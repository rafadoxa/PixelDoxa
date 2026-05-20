/**
 * POST /api/pixel-convert
 *
 * True Pixel — Convert ANY image to pixel art.
 *
 * Pipeline (all server-side via sharp):
 *  1. Decode source image (URL or base64 data URL)
 *  2. Smart pre-process:
 *     - Optional contrast boost before downscaling (makes edges crisper)
 *     - Optional saturation boost (pixel art needs punchy colors)
 *  3. Nearest-neighbor downsample to target pixel size
 *  4. Color quantization — clamp every pixel to chosen palette
 *     - "none"    → keep original colors at low-res (no palette lock)
 *     - dithering → Floyd-Steinberg error diffusion (manual, pixel-perfect)
 *  5. Nearest-neighbor upscale to preview resolution (so the browser
 *     doesn't blur the pixels — we control the output size)
 *  6. Return: base64 PNG (upscaled for display) + base64 PNG (true pixel size)
 *
 * Request body:
 * {
 *   imageUrl:       string   // http(s):// URL  OR  data:image/...;base64,...
 *   pixelSize:      number   // output pixel resolution (8–256, default 64)
 *   palette:        string   // "none"|"default"|"gameboy"|"nes"|"snes"|"pico8"|"endesga32"|"monokai"|"custom"
 *   customPalette?: string[] // hex colors for "custom" palette
 *   dither:         boolean  // Floyd-Steinberg dithering (default false)
 *   contrastBoost:  number   // 0–100, sharpen edges before downscale (default 0)
 *   saturation:     number   // 0.5–3.0 saturation multiplier (default 1.0)
 *   upscalePreview: number   // output preview multiplier e.g. 4 → 64px becomes 256px (default 4)
 *   outline:        boolean  // add 1px dark outline around non-transparent regions
 *   outlineColor?:  string   // hex color for outline (default "#000000")
 * }
 *
 * Response:
 * {
 *   success:        boolean
 *   previewDataUrl: string   // upscaled PNG for display (pixelated rendering)
 *   trueDataUrl:    string   // true-size PNG (pixelSize × pixelSize)
 *   pixelSize:      number
 *   previewSize:    number
 *   palette:        string
 *   processingMs:   number
 * }
 */

import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

// ── Palette Definitions (RGB) ───────────────────────────────────────────────

type RGB = [number, number, number]

const PALETTES: Record<string, RGB[]> = {
  default: [
    [26,28,44],[93,39,93],[177,62,83],[239,125,87],[255,205,117],[167,240,112],
    [56,183,100],[37,113,121],[41,54,111],[59,93,201],[65,166,246],[115,239,247],
    [255,255,255],[190,220,211],[132,145,181],[73,77,126],
  ],
  gameboy: [
    [15,56,15],[48,98,48],[139,172,15],[155,188,15],
  ],
  nes: [
    [84,84,84],[0,30,116],[8,16,144],[48,0,136],[68,0,100],[92,0,48],[84,4,0],[60,24,0],
    [32,42,0],[8,58,0],[0,64,0],[0,60,0],[0,50,60],[0,0,0],
    [152,150,152],[8,76,196],[48,50,236],[92,30,228],[136,20,176],[160,20,100],
    [152,34,32],[120,60,0],[84,90,0],[40,114,0],[8,124,0],[0,118,40],[0,102,120],
    [236,238,236],[76,154,236],[120,124,236],[176,98,236],[228,84,236],[236,88,180],
    [236,106,100],[212,136,32],[160,170,0],[116,196,0],[76,208,32],[56,204,108],
    [56,180,204],[60,60,60],
  ],
  snes: [
    [0,0,0],[248,248,248],[104,136,252],[252,112,136],[124,124,252],[168,0,168],
    [252,164,0],[248,56,0],[72,184,72],[0,120,0],[0,184,252],[0,88,252],
    [60,60,60],[120,120,120],[176,176,176],[252,252,252],[252,228,160],[228,132,0],
    [188,68,0],[136,20,0],[0,228,252],[0,168,228],[0,88,168],[0,20,100],
    [80,252,80],[0,188,0],[0,104,0],[0,40,0],[252,160,252],[252,80,252],[188,0,188],[88,0,88],
  ],
  pico8: [
    [0,0,0],[29,43,83],[126,37,83],[0,135,81],[171,82,54],[95,87,79],[194,195,199],[255,241,232],
    [255,0,77],[255,163,0],[255,236,39],[0,228,54],[41,173,255],[131,118,156],[255,119,168],[255,204,170],
  ],
  endesga32: [
    [190,74,47],[215,118,67],[234,212,170],[228,166,114],[184,111,80],[116,63,57],[68,36,52],[52,28,39],
    [41,54,111],[59,93,201],[65,166,246],[115,239,247],[52,52,52],[78,78,78],[112,112,112],[160,160,160],
    [208,208,208],[255,255,255],[73,188,97],[50,133,92],[37,96,81],[24,64,68],[14,40,60],
    [254,231,97],[254,174,52],[254,110,76],[254,61,61],[180,35,92],[109,16,113],[62,9,102],[25,7,53],[14,14,23],
  ],
  monokai: [
    [39,40,34],[75,70,58],[117,113,94],[166,162,140],[248,248,242],[249,38,114],
    [102,217,239],[166,226,46],[253,151,31],[174,129,255],[104,206,220],[190,6,64],
    [63,160,7],[134,95,24],[33,109,162],[117,80,194],
  ],
  // Extra palettes for True Pixel
  grayscale: Array.from({ length: 8 }, (_, i) => {
    const v = Math.round((i / 7) * 255)
    return [v, v, v] as RGB
  }),
  cga: [
    [0,0,0],[0,170,170],[170,0,170],[170,170,170],  // mode 1 palette
    [0,0,0],[0,170,0],[170,0,0],[170,85,0],          // mode 0 palette
    [85,85,85],[85,255,255],[255,85,255],[255,255,255],
    [85,85,85],[85,255,85],[255,85,85],[255,255,85],
  ],
  c64: [
    [0,0,0],[255,255,255],[136,0,0],[170,255,238],[204,68,204],[0,204,85],
    [0,0,170],[238,238,119],[221,136,85],[102,68,0],[255,119,119],[51,51,51],
    [119,119,119],[170,255,102],[0,136,255],[187,187,187],
  ],
}

// ── Color utilities ─────────────────────────────────────────────────────────

function colorDist(a: RGB, b: RGB): number {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  // Perceptual weighting (human eyes are most sensitive to green)
  return 2*dr*dr + 4*dg*dg + 3*db*db
}

function nearestColor(pixel: RGB, palette: RGB[]): RGB {
  let best = palette[0]
  let bestDist = colorDist(pixel, best)
  for (let i = 1; i < palette.length; i++) {
    const d = colorDist(pixel, palette[i])
    if (d < bestDist) { bestDist = d; best = palette[i] }
  }
  return best
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "")
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

// ── Fetch image to Buffer ───────────────────────────────────────────────────

async function fetchImage(imageUrl: string): Promise<Buffer> {
  if (imageUrl.startsWith("data:")) {
    const b64 = imageUrl.split(",")[1]
    return Buffer.from(b64, "base64")
  }
  const res = await fetch(imageUrl, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
  return Buffer.from(await res.arrayBuffer())
}

// ── Smart pre-process ───────────────────────────────────────────────────────
// Contrast + saturation before downscale → crisper pixels

async function preProcess(
  buf: Buffer,
  contrastBoost: number,   // 0–100
  saturation: number       // 0.5–3.0
): Promise<Buffer> {
  let pipeline = sharp(buf).ensureAlpha()

  // Apply modulate (saturation) if != 1.0
  if (saturation !== 1.0) {
    pipeline = pipeline.modulate({ saturation })
  }

  // Apply linear contrast boost if > 0
  // Maps to sharp linear: a*x + b  (a = 1 + boost/100, b centers it)
  if (contrastBoost > 0) {
    const a = 1 + contrastBoost / 100
    const b = -(128 * (a - 1))
    pipeline = pipeline.linear(a, b)
  }

  return pipeline.png().toBuffer()
}

// ── Quantize (no dither) ────────────────────────────────────────────────────

function quantizeNoDither(
  raw: Buffer,
  w: number,
  h: number,
  palette: RGB[]
): Buffer {
  const out = Buffer.from(raw)
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    const a = out[o + 3]
    if (a < 10) { out[o] = out[o+1] = out[o+2] = out[o+3] = 0; continue }
    const nearest = nearestColor([out[o], out[o+1], out[o+2]], palette)
    out[o] = nearest[0]; out[o+1] = nearest[1]; out[o+2] = nearest[2]
    out[o+3] = 255
  }
  return out
}

// ── Floyd-Steinberg dithering ───────────────────────────────────────────────
// Classic error-diffusion dithering for smooth gradients at low color counts.
// Error is distributed to 4 neighbors:
//   [ *  7/16 ]
//   [ 3/16  5/16  1/16 ]

function quantizeDither(
  raw: Buffer,
  w: number,
  h: number,
  palette: RGB[]
): Buffer {
  // Work on float arrays so we can accumulate sub-integer error
  const r = new Float32Array(w * h)
  const g = new Float32Array(w * h)
  const b = new Float32Array(w * h)
  const a = new Uint8Array(w * h)

  for (let i = 0; i < w * h; i++) {
    r[i] = raw[i*4]
    g[i] = raw[i*4+1]
    b[i] = raw[i*4+2]
    a[i] = raw[i*4+3]
  }

  const out = Buffer.alloc(w * h * 4, 0)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (a[i] < 10) {
        // transparent — skip
        out[i*4+3] = 0
        continue
      }

      const oldR = clamp(r[i])
      const oldG = clamp(g[i])
      const oldB = clamp(b[i])

      const nearest = nearestColor([oldR, oldG, oldB], palette)

      out[i*4]   = nearest[0]
      out[i*4+1] = nearest[1]
      out[i*4+2] = nearest[2]
      out[i*4+3] = 255

      const er = oldR - nearest[0]
      const eg = oldG - nearest[1]
      const eb = oldB - nearest[2]

      // Distribute error to neighbors
      const spread = (ix: number, iy: number, fr: number, fg: number, fb: number) => {
        if (ix < 0 || ix >= w || iy >= h) return
        const ni = iy * w + ix
        if (a[ni] < 10) return
        r[ni] += er * fr
        g[ni] += eg * fg
        b[ni] += eb * fb
      }

      spread(x+1, y,   7/16, 7/16, 7/16)
      spread(x-1, y+1, 3/16, 3/16, 3/16)
      spread(x,   y+1, 5/16, 5/16, 5/16)
      spread(x+1, y+1, 1/16, 1/16, 1/16)
    }
  }

  return out
}

// ── Outline pass ────────────────────────────────────────────────────────────
// Adds a 1px dark outline around any non-transparent pixel that borders a transparent one.

function addOutline(
  raw: Buffer,
  w: number,
  h: number,
  color: RGB
): Buffer {
  const out = Buffer.from(raw)
  const isTransparent = (x: number, y: number): boolean => {
    if (x < 0 || x >= w || y < 0 || y >= h) return true
    return raw[(y * w + x) * 4 + 3] < 10
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (raw[i + 3] < 10) {
        // This pixel is transparent — check if any 4-neighbor is opaque
        const hasOpaque =
          !isTransparent(x-1, y) || !isTransparent(x+1, y) ||
          !isTransparent(x, y-1) || !isTransparent(x, y+1)
        if (hasOpaque) {
          out[i]   = color[0]
          out[i+1] = color[1]
          out[i+2] = color[2]
          out[i+3] = 255
        }
      }
    }
  }

  return out
}

// ── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const t0 = Date.now()

  try {
    const body = await req.json()
    const {
      imageUrl,
      pixelSize      = 64,
      palette        = "default",
      customPalette,
      dither         = false,
      contrastBoost  = 0,
      saturation     = 1.0,
      upscalePreview = 4,
      outline        = false,
      outlineColor   = "#000000",
    } = body

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    const clampedSize   = Math.max(8, Math.min(256, Math.round(pixelSize)))
    const clampedUp     = Math.max(1, Math.min(16, Math.round(upscalePreview)))

    // ── 1. Load source ─────────────────────────────────────────────────────
    const srcBuf = await fetchImage(imageUrl)

    // ── 2. Pre-process (contrast + saturation) ────────────────────────────
    const preBuf = await preProcess(srcBuf, contrastBoost, saturation)

    // ── 3. Nearest-neighbor downsample to pixel size ──────────────────────
    const downRaw = await sharp(preBuf)
      .resize(clampedSize, clampedSize, {
        kernel: "nearest",
        fit: "fill",
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { data: rawPixels, info: rawInfo } = downRaw
    const W = rawInfo.width
    const H = rawInfo.height

    // ── 4. Color quantization ─────────────────────────────────────────────
    let pal: RGB[]
    if (palette === "none") {
      // No palette — just use the raw downsampled pixels as-is
      pal = []
    } else if (palette === "custom" && Array.isArray(customPalette) && customPalette.length > 0) {
      pal = customPalette.map((h: string) => hexToRgb(h))
    } else {
      pal = PALETTES[palette] ?? PALETTES["default"]
    }

    let quantizedBuf: Buffer
    if (palette === "none") {
      // No quantization — just snap alpha
      quantizedBuf = Buffer.from(rawPixels)
      for (let i = 0; i < W * H; i++) {
        if (quantizedBuf[i*4+3] < 10) {
          quantizedBuf[i*4] = quantizedBuf[i*4+1] = quantizedBuf[i*4+2] = quantizedBuf[i*4+3] = 0
        } else {
          quantizedBuf[i*4+3] = 255
        }
      }
    } else if (dither) {
      quantizedBuf = quantizeDither(rawPixels, W, H, pal)
    } else {
      quantizedBuf = quantizeNoDither(rawPixels, W, H, pal)
    }

    // ── 5. Optional outline ───────────────────────────────────────────────
    let finalRaw = quantizedBuf
    if (outline) {
      const outRGB = hexToRgb(outlineColor)
      finalRaw = addOutline(quantizedBuf, W, H, outRGB)
    }

    // ── 6. Encode true-size PNG ───────────────────────────────────────────
    const truePng = await sharp(finalRaw, {
      raw: { width: W, height: H, channels: 4 },
    }).png({ compressionLevel: 9 }).toBuffer()

    const trueDataUrl = `data:image/png;base64,${truePng.toString("base64")}`

    // ── 7. Upscale for preview (nearest-neighbor) ─────────────────────────
    const previewSize = clampedSize * clampedUp
    const previewPng = await sharp(finalRaw, {
      raw: { width: W, height: H, channels: 4 },
    })
      .resize(previewSize, previewSize, { kernel: "nearest", fit: "fill" })
      .png({ compressionLevel: 6 })
      .toBuffer()

    const previewDataUrl = `data:image/png;base64,${previewPng.toString("base64")}`

    return NextResponse.json({
      success:        true,
      previewDataUrl,
      trueDataUrl,
      pixelSize:      clampedSize,
      previewSize,
      palette,
      dither,
      processingMs:   Date.now() - t0,
    })

  } catch (error: unknown) {
    console.error("Pixel convert error:", error)
    const message = error instanceof Error ? error.message : "Conversion failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
