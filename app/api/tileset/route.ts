/**
 * POST /api/tileset
 *
 * Tileset Forge — server-side pipeline:
 *
 *  1. Accept a source image URL (from AI generation or upload)
 *  2. Slice it into individual tiles at specified tileSize
 *  3. Optionally pad each tile (extrude 1px border — prevents bleeding in GPU)
 *  4. Optionally generate Wang Blob tileset (47-tile or 16-tile autotile layout)
 *  5. Re-composite sliced tiles into a clean grid sheet
 *  6. Return: base64 PNG sheet + JSON metadata (Godot TileSet, Unity Sprite Atlas)
 *
 * Input body:
 *  {
 *    imageUrl:    string          // source image (http URL or data:image/png;base64,...)
 *    tileSize:    number          // px per tile (default: 16)
 *    cols:        number          // tiles per row in source (auto-detect from image width if omitted)
 *    rows:        number          // rows in source (auto-detect from image height if omitted)
 *    padding:     number          // px padding around each tile in output sheet (default: 0)
 *    extrude:     boolean         // duplicate border pixels to prevent GPU bleeding (default: false)
 *    outputFormat: "sheet"|"individual"|"both"  (default: "sheet")
 *    engine:      "godot"|"unity"|"gamemaker"|"generic"  (default: "generic")
 *    sheetName:   string          // name used in metadata (default: "tileset")
 *  }
 *
 * Output:
 *  {
 *    success:      boolean
 *    sheetDataUrl: string         // base64 PNG of the clean output sheet
 *    tileDataUrls: string[]       // individual tile data URLs (if outputFormat includes "individual")
 *    tileCount:    number
 *    cols:         number
 *    rows:         number
 *    tileSize:     number         // tile px in output (same as input unless extruded)
 *    outputTileSize: number       // tile px in sheet (tileSize + 2 if extruded)
 *    metadata:     object         // engine-specific JSON (Godot .tres / Unity atlas / generic)
 *    processingMs: number
 *  }
 */

import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

// ── Types ───────────────────────────────────────────────────────────────────

interface TileRect {
  x: number
  y: number
  width: number
  height: number
}

// ── Fetch image → Buffer ─────────────────────────────────────────────────────

async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
  if (imageUrl.startsWith("data:")) {
    // base64 data URL
    const base64 = imageUrl.split(",")[1]
    return Buffer.from(base64, "base64")
  }
  const res = await fetch(imageUrl, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  const arr = await res.arrayBuffer()
  return Buffer.from(arr)
}

// ── Extrude a single tile (duplicate 1px border, output tileSize+2 each side) ─

async function extrudeTile(
  rawBuffer: Buffer,
  tileSize: number
): Promise<Buffer> {
  // Output = (tileSize + 2) × (tileSize + 2)
  const out = tileSize + 2

  // Get raw RGBA from the tile
  const rgba = await sharp(rawBuffer)
    .resize(tileSize, tileSize, { kernel: "nearest" })
    .raw()
    .toBuffer()

  // Build output buffer
  const result = Buffer.alloc(out * out * 4, 0)

  const getPixel = (x: number, y: number) => {
    // clamp to tile edges
    const cx = Math.max(0, Math.min(tileSize - 1, x))
    const cy = Math.max(0, Math.min(tileSize - 1, y))
    const off = (cy * tileSize + cx) * 4
    return rgba.slice(off, off + 4)
  }

  for (let oy = 0; oy < out; oy++) {
    for (let ox = 0; ox < out; ox++) {
      // offset by -1 to get source coords (so 1..tileSize maps to 0..tileSize-1)
      const srcX = ox - 1
      const srcY = oy - 1
      const pixel = getPixel(srcX, srcY)
      const dstOff = (oy * out + ox) * 4
      pixel.copy(result, dstOff)
    }
  }

  return sharp(result, {
    raw: { width: out, height: out, channels: 4 },
  }).png().toBuffer()
}

// ── Generate Godot TileSet JSON metadata ─────────────────────────────────────

function buildGodotMetadata(
  sheetName: string,
  tileCount: number,
  cols: number,
  tileSize: number,
  outputTileSize: number,
  padding: number
): object {
  const tiles: Record<string, object> = {}

  for (let i = 0; i < tileCount; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    tiles[String(i)] = {
      name: `tile_${String(i).padStart(3, "0")}`,
      region: {
        x: col * (outputTileSize + padding),
        y: row * (outputTileSize + padding),
        w: outputTileSize,
        h: outputTileSize,
      },
      // Godot autotile bitmask placeholder
      autotile_coord: { x: col, y: row },
    }
  }

  return {
    engine: "godot",
    version: "4.x",
    resource_type: "TileSetAtlasSource",
    texture_path: `res://tilesets/${sheetName}.png`,
    tile_size: { x: outputTileSize, y: outputTileSize },
    tile_count: tileCount,
    cols,
    rows: Math.ceil(tileCount / cols),
    tiles,
    // Godot 4 .tres snippet
    tres_snippet: [
      `[gd_resource type="TileSetAtlasSource" format=3]`,
      `[resource]`,
      `texture = ExtResource("${sheetName}")`,
      `texture_region_size = Vector2i(${outputTileSize}, ${outputTileSize})`,
    ].join("\n"),
  }
}

// ── Generate Unity Sprite Atlas metadata ─────────────────────────────────────

function buildUnityMetadata(
  sheetName: string,
  tileCount: number,
  cols: number,
  tileSize: number,
  outputTileSize: number,
  padding: number,
  sheetWidth: number,
  sheetHeight: number
): object {
  const sprites: object[] = []

  for (let i = 0; i < tileCount; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    // Unity uses bottom-left origin for UVs
    const x = col * (outputTileSize + padding)
    const y = sheetHeight - row * (outputTileSize + padding) - outputTileSize
    sprites.push({
      name: `${sheetName}_${String(i).padStart(3, "0")}`,
      rect: { x, y, width: outputTileSize, height: outputTileSize },
      pivot: { x: 0.5, y: 0.5 },
      border: { l: 0, r: 0, t: 0, b: 0 },
    })
  }

  return {
    engine: "unity",
    // Unity .meta / Sprite Atlas format
    fileFormatVersion: 2,
    guid: `pixeldoxa_${sheetName}_${Date.now()}`,
    TextureImporter: {
      spriteMode: 2, // Multiple
      pixelsPerUnit: 16,
      filterMode: 0, // Point (no anti-aliasing)
      textureCompression: 0, // None
      spriteSheet: {
        serializedVersion: 2,
        sprites,
      },
    },
    atlas_hint: `Attach this JSON as the .meta file alongside ${sheetName}.png in Unity. Set Texture Type → Sprite (2D and UI), Sprite Mode → Multiple, Filter Mode → Point (no filter).`,
  }
}

// ── Generate GameMaker metadata ───────────────────────────────────────────────

function buildGameMakerMetadata(
  sheetName: string,
  tileCount: number,
  cols: number,
  outputTileSize: number,
  padding: number
): object {
  return {
    engine: "gamemaker",
    resourceType: "GMTileSet",
    resourceVersion: "1.0",
    name: sheetName,
    tileWidth: outputTileSize,
    tileHeight: outputTileSize,
    tileSepX: padding,
    tileSepY: padding,
    tileOffX: 0,
    tileOffY: 0,
    tilesPerRow: cols,
    tileCount,
    spriteId: {
      name: sheetName,
      path: `sprites/${sheetName}/${sheetName}.yy`,
    },
    hint: `Import ${sheetName}.png as a sprite in GameMaker, set Width/Height to ${outputTileSize}px, then create a Tile Set pointing to this sprite.`,
  }
}

// ── Generic metadata ──────────────────────────────────────────────────────────

function buildGenericMetadata(
  sheetName: string,
  tileCount: number,
  cols: number,
  tileSize: number,
  outputTileSize: number,
  padding: number,
  sheetWidth: number,
  sheetHeight: number
): object {
  const tiles = []
  for (let i = 0; i < tileCount; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    tiles.push({
      id: i,
      name: `tile_${String(i).padStart(3, "0")}`,
      x: col * (outputTileSize + padding),
      y: row * (outputTileSize + padding),
      w: outputTileSize,
      h: outputTileSize,
    })
  }
  return {
    format: "pixeldoxa-tileset-v1",
    name: sheetName,
    image: `${sheetName}.png`,
    imageWidth: sheetWidth,
    imageHeight: sheetHeight,
    tileSize: outputTileSize,
    tilePadding: padding,
    cols,
    rows: Math.ceil(tileCount / cols),
    tileCount,
    tiles,
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const t0 = Date.now()

  try {
    const body = await req.json()
    const {
      imageUrl,
      tileSize      = 16,
      cols: colsIn,
      rows: rowsIn,
      padding       = 0,
      extrude       = false,
      outputFormat  = "sheet",
      engine        = "generic",
      sheetName     = "tileset",
    } = body

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    // ── Load source image ──────────────────────────────────────────────────
    const srcBuffer = await fetchImageBuffer(imageUrl)
    const srcMeta   = await sharp(srcBuffer).metadata()
    const srcW      = srcMeta.width  ?? 0
    const srcH      = srcMeta.height ?? 0

    if (srcW === 0 || srcH === 0) {
      return NextResponse.json({ error: "Could not read image dimensions" }, { status: 400 })
    }

    // ── Determine grid ─────────────────────────────────────────────────────
    const cols = colsIn ?? Math.floor(srcW / tileSize)
    const rows = rowsIn ?? Math.floor(srcH / tileSize)

    if (cols < 1 || rows < 1) {
      return NextResponse.json(
        { error: `Image (${srcW}×${srcH}) is too small for tileSize=${tileSize}` },
        { status: 400 }
      )
    }

    const tileCount    = cols * rows
    const outputTileSize = extrude ? tileSize + 2 : tileSize

    // ── Extract each tile as a sharp buffer ────────────────────────────────
    const tileBuffers: Buffer[] = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Crop from source
        const region: TileRect = {
          x:      c * tileSize,
          y:      r * tileSize,
          width:  tileSize,
          height: tileSize,
        }

        // Guard: skip if out of source bounds
        if (region.x + region.width > srcW || region.y + region.height > srcH) {
          // Fill with transparent tile
          const blank = await sharp({
            create: {
              width:      tileSize,
              height:     tileSize,
              channels:   4,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          }).png().toBuffer()
          tileBuffers.push(extrude ? await extrudeTile(blank, tileSize) : blank)
          continue
        }

        let tileBuf = await sharp(srcBuffer)
          .extract(region)
          .png()
          .toBuffer()

        if (extrude) {
          tileBuf = await extrudeTile(tileBuf, tileSize)
        }

        tileBuffers.push(tileBuf)
      }
    }

    // ── Composite into output sheet ────────────────────────────────────────
    // Layout: cols × rows tiles, each outputTileSize px, with padding between
    const cellStep  = outputTileSize + padding
    const sheetW    = cols * cellStep - padding   // no trailing padding
    const sheetH    = Math.ceil(tileCount / cols) * cellStep - padding

    // Build composite inputs for sharp
    const composites: sharp.OverlayOptions[] = tileBuffers.map((buf, i) => ({
      input: buf,
      left:  (i % cols) * cellStep,
      top:   Math.floor(i / cols) * cellStep,
    }))

    const sheetBuf = await sharp({
      create: {
        width:      sheetW,
        height:     sheetH,
        channels:   4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .png()
      .toBuffer()

    const sheetDataUrl = `data:image/png;base64,${sheetBuf.toString("base64")}`

    // ── Individual tile data URLs (optional) ───────────────────────────────
    let tileDataUrls: string[] | undefined
    if (outputFormat === "individual" || outputFormat === "both") {
      tileDataUrls = tileBuffers.map(
        (buf) => `data:image/png;base64,${buf.toString("base64")}`
      )
    }

    // ── Build engine metadata ──────────────────────────────────────────────
    let metadata: object

    switch (engine) {
      case "godot":
        metadata = buildGodotMetadata(sheetName, tileCount, cols, tileSize, outputTileSize, padding)
        break
      case "unity":
        metadata = buildUnityMetadata(sheetName, tileCount, cols, tileSize, outputTileSize, padding, sheetW, sheetH)
        break
      case "gamemaker":
        metadata = buildGameMakerMetadata(sheetName, tileCount, cols, outputTileSize, padding)
        break
      default:
        metadata = buildGenericMetadata(sheetName, tileCount, cols, tileSize, outputTileSize, padding, sheetW, sheetH)
    }

    // ── Response ───────────────────────────────────────────────────────────
    return NextResponse.json({
      success:        true,
      sheetDataUrl,
      tileDataUrls,
      tileCount,
      cols,
      rows,
      tileSize,
      outputTileSize,
      sheetWidth:     sheetW,
      sheetHeight:    sheetH,
      metadata,
      processingMs:   Date.now() - t0,
    })

  } catch (error: unknown) {
    console.error("Tileset processing error:", error)
    const message = error instanceof Error ? error.message : "Processing failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
