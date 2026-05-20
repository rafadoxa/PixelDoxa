/**
 * POST /api/spritesheet
 *
 * Accepts an array of base64/URL image frames + layout config.
 * Returns either:
 *   - "sheet"  → a PNG sprite sheet (all frames tiled in a grid)
 *   - "gif"    → an animated GIF
 *   - "both"   → JSON with { sheetDataUrl, gifDataUrl }
 *
 * Body:
 *   frames       string[]   base64 data URLs or https:// URLs (max 64)
 *   cols         number     frames per row  (default: auto-square)
 *   frameWidth   number     px per frame (all frames resized to this)
 *   frameHeight  number     px per frame
 *   fps          number     GIF frames per second (1–30, default 8)
 *   output       "sheet" | "gif" | "both"
 *   padding      number     px gap between frames in sheet (default 1)
 */

import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
// @ts-expect-error — gifencoder has no official TS types shipped with package
import GIFEncoder from "gifencoder"
import { createCanvas, createImageData } from "canvas"

// ── helpers ────────────────────────────────────────────────────────────────

/** Decode any frame (data URL or https URL) → raw RGBA Buffer at target size */
async function decodeFrame(
  src: string,
  width: number,
  height: number
): Promise<Buffer> {
  let inputBuffer: Buffer

  if (src.startsWith("data:")) {
    const base64 = src.split(",")[1]
    inputBuffer = Buffer.from(base64, "base64")
  } else {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`Failed to fetch frame: ${res.status}`)
    inputBuffer = Buffer.from(await res.arrayBuffer())
  }

  // Resize to exact frame size with nearest-neighbor (keep pixel art crisp)
  const { data } = await sharp(inputBuffer)
    .resize(width, height, { kernel: "nearest", fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return data
}

/** Stitch frames into a single PNG sprite sheet */
async function buildSheet(
  frames: Buffer[],
  frameW: number,
  frameH: number,
  cols: number,
  padding: number
): Promise<Buffer> {
  const rows = Math.ceil(frames.length / cols)
  const sheetW = cols * frameW + (cols + 1) * padding
  const sheetH = rows * frameH + (rows + 1) * padding

  // Build a blank RGBA sheet (fully transparent)
  const sheetData = Buffer.alloc(sheetW * sheetH * 4, 0)

  for (let i = 0; i < frames.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const ox = padding + col * (frameW + padding)
    const oy = padding + row * (frameH + padding)

    const frameData = frames[i]
    for (let py = 0; py < frameH; py++) {
      for (let px = 0; px < frameW; px++) {
        const srcIdx = (py * frameW + px) * 4
        const dstIdx = ((oy + py) * sheetW + (ox + px)) * 4
        sheetData[dstIdx]     = frameData[srcIdx]
        sheetData[dstIdx + 1] = frameData[srcIdx + 1]
        sheetData[dstIdx + 2] = frameData[srcIdx + 2]
        sheetData[dstIdx + 3] = frameData[srcIdx + 3]
      }
    }
  }

  return sharp(sheetData, {
    raw: { width: sheetW, height: sheetH, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Build an animated GIF from raw RGBA frames using gifencoder + canvas */
function buildGif(
  frames: Buffer[],
  frameW: number,
  frameH: number,
  fps: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const encoder = new GIFEncoder(frameW, frameH)
    const chunks: Buffer[] = []

    encoder.createReadStream().on("data", (chunk: Buffer) => chunks.push(chunk))
    encoder.createReadStream().on("end", () => resolve(Buffer.concat(chunks)))
    encoder.createReadStream().on("error", reject)

    encoder.start()
    encoder.setRepeat(0)          // 0 = loop forever
    encoder.setDelay(Math.round(1000 / fps))
    encoder.setQuality(1)         // 1 = best quality (slower), 20 = fast

    const canvas = createCanvas(frameW, frameH)
    const ctx = canvas.getContext("2d")

    for (const frame of frames) {
      // gifencoder needs RGBA pixel data via ImageData
      const imgData = createImageData(
        new Uint8ClampedArray(frame),
        frameW,
        frameH
      )
      ctx.putImageData(imgData, 0, 0)
      encoder.addFrame(ctx)
    }

    encoder.finish()
  })
}

// ── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      frames: rawFrames,
      cols: rawCols,
      frameWidth  = 64,
      frameHeight = 64,
      fps         = 8,
      output      = "both",
      padding     = 1,
    } = body

    // Validate
    if (!Array.isArray(rawFrames) || rawFrames.length < 1) {
      return NextResponse.json({ error: "frames array required" }, { status: 400 })
    }
    if (rawFrames.length > 64) {
      return NextResponse.json({ error: "Max 64 frames" }, { status: 400 })
    }

    const frameW  = Math.max(8,  Math.min(512, Number(frameWidth)))
    const frameH  = Math.max(8,  Math.min(512, Number(frameHeight)))
    const safeFps = Math.max(1,  Math.min(30,  Number(fps)))
    const safePad = Math.max(0,  Math.min(8,   Number(padding)))
    const cols    = rawCols
      ? Math.max(1, Math.min(rawFrames.length, Number(rawCols)))
      : Math.ceil(Math.sqrt(rawFrames.length))

    // Decode all frames to raw RGBA buffers
    const frames = await Promise.all(
      rawFrames.map((src: string) => decodeFrame(src, frameW, frameH))
    )

    // Build outputs
    const results: Record<string, string> = {}

    if (output === "sheet" || output === "both") {
      const sheetBuf = await buildSheet(frames, frameW, frameH, cols, safePad)
      results.sheetDataUrl = `data:image/png;base64,${sheetBuf.toString("base64")}`
    }

    if (output === "gif" || output === "both") {
      const gifBuf = await buildGif(frames, frameW, frameH, safeFps)
      results.gifDataUrl = `data:image/gif;base64,${gifBuf.toString("base64")}`
    }

    return NextResponse.json({
      success: true,
      frameCount: frames.length,
      frameWidth: frameW,
      frameHeight: frameH,
      cols,
      rows: Math.ceil(frames.length / cols),
      fps: safeFps,
      ...results,
    })

  } catch (err: unknown) {
    console.error("Spritesheet error:", err)
    const message = err instanceof Error ? err.message : "Failed to build spritesheet"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
