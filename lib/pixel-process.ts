/**
 * pixel-process.ts
 * Server-side pixel art post-processing pipeline.
 *
 * Steps:
 *  1. gridSnap   — nearest-neighbor downsample to target sprite size (16–256 px)
 *  2. quantize   — clamp every pixel to the nearest color in a fixed palette (Euclidean RGB)
 *  3. encode     — re-encode as PNG (preserving alpha channel)
 *
 * Used exclusively in app/api/generate/route.ts (Node.js / Edge-free)
 */

import sharp from "sharp"

// ─── Palette Definitions (RGB tuples) ────────────────────────────────────────

type RGB = [number, number, number]

const PALETTES: Record<string, RGB[]> = {
  /**
   * Default — 16-color "sweetie16" palette by GrafxKid
   * A balanced general-purpose pixel art palette.
   */
  default: [
    [26, 28, 44],   // #1a1c2c  black
    [93, 39, 93],   // #5d275d  dark purple
    [177, 62, 83],  // #b13e53  red
    [239, 125, 87], // #ef7d57  orange
    [255, 205, 117],// #ffcd75  yellow
    [167, 240, 112],// #a7f070  lime
    [56, 183, 100], // #38b764  green
    [37, 113, 121], // #257179  teal
    [41, 54, 111],  // #29366f  dark blue
    [59, 93, 201],  // #3b5dc9  blue
    [65, 166, 246], // #41a6f6  sky
    [115, 239, 247],// #73eff7  cyan
    [255, 255, 255],// #ffffff  white
    [190, 220, 211],// #bedcd3  light grey
    [132, 145, 181],// #8491b5  mid grey
    [73, 77, 126],  // #494d7e  dark grey
  ],

  /**
   * Game Boy — 4-color original DMG green palette
   */
  gameboy: [
    [15, 56, 15],   // #0f380f  darkest green
    [48, 98, 48],   // #306230  dark green
    [139, 172, 15], // #8bac0f  light green
    [155, 188, 15], // #9bbc0f  lightest green
  ],

  /**
   * NES — 54 hardware colors (commonly available subset)
   * Source: nesdev.org accurate palette
   */
  nes: [
    [84, 84, 84],   [0, 30, 116],   [8, 16, 144],   [48, 0, 136],
    [68, 0, 100],   [92, 0, 48],    [84, 4, 0],      [60, 24, 0],
    [32, 42, 0],    [8, 58, 0],     [0, 64, 0],      [0, 60, 0],
    [0, 50, 60],    [0, 0, 0],      [0, 0, 0],       [0, 0, 0],
    [152, 150, 152],[8, 76, 196],   [48, 50, 236],   [92, 30, 228],
    [136, 20, 176], [160, 20, 100], [152, 34, 32],   [120, 60, 0],
    [84, 90, 0],    [40, 114, 0],   [8, 124, 0],     [0, 118, 40],
    [0, 102, 120],  [0, 0, 0],      [0, 0, 0],       [0, 0, 0],
    [236, 238, 236],[76, 154, 236], [120, 124, 236],  [176, 98, 236],
    [228, 84, 236], [236, 88, 180], [236, 106, 100], [212, 136, 32],
    [160, 170, 0],  [116, 196, 0],  [76, 208, 32],   [56, 204, 108],
    [56, 180, 204], [60, 60, 60],   [0, 0, 0],       [0, 0, 0],
    [236, 238, 236],[168, 204, 236],[188, 188, 236],  [212, 178, 236],
    [236, 174, 236],[236, 174, 212],[236, 180, 176],  [228, 196, 144],
    [204, 210, 120],[180, 222, 120],[168, 226, 144],  [152, 226, 180],
    [160, 214, 228],[160, 162, 160],
  ],

  /**
   * SNES — Approximate 15-bit (32768 colors possible, but
   * typical SNES games used subsets of ~256 colors in 8 palettes of 15+transparent).
   * We use a curated 32-color representative set.
   */
  snes: [
    [0, 0, 0],      [248, 248, 248],[104, 136, 252], [252, 112, 136],
    [124, 124, 252],[168, 0, 168],  [252, 164, 0],   [248, 56, 0],
    [72, 184, 72],  [0, 120, 0],    [0, 184, 252],   [0, 88, 252],
    [60, 60, 60],   [120, 120, 120],[176, 176, 176],  [252, 252, 252],
    [252, 228, 160],[228, 132, 0],  [188, 68, 0],    [136, 20, 0],
    [0, 228, 252],  [0, 168, 228],  [0, 88, 168],    [0, 20, 100],
    [80, 252, 80],  [0, 188, 0],    [0, 104, 0],     [0, 40, 0],
    [252, 160, 252],[252, 80, 252], [188, 0, 188],   [88, 0, 88],
  ],

  /**
   * PICO-8 — exact 16-color palette
   */
  pico8: [
    [0, 0, 0],      [29, 43, 83],   [126, 37, 83],  [0, 135, 81],
    [171, 82, 54],  [95, 87, 79],   [194, 195, 199],[255, 241, 232],
    [255, 0, 77],   [255, 163, 0],  [255, 236, 39], [0, 228, 54],
    [41, 173, 255], [131, 118, 156],[255, 119, 168],[255, 204, 170],
  ],

  /**
   * Endesga32 — 32-color palette by Endesga
   * Popular indie/jam palette, balanced warm/cool tones.
   */
  endesga32: [
    [190, 74, 47],  [215, 118, 67], [234, 212, 170],[228, 166, 114],
    [184, 111, 80], [116, 63, 57],  [68, 36, 52],   [52, 28, 39],
    [41, 54, 111],  [59, 93, 201],  [65, 166, 246], [115, 239, 247],
    [52, 52, 52],   [78, 78, 78],   [112, 112, 112],[160, 160, 160],
    [208, 208, 208],[255, 255, 255],[73, 188, 97],  [50, 133, 92],
    [37, 96, 81],   [24, 64, 68],   [14, 40, 60],   [254, 231, 97],
    [254, 174, 52], [254, 110, 76], [254, 61, 61],  [180, 35, 92],
    [109, 16, 113], [62, 9, 102],   [25, 7, 53],    [14, 14, 23],
  ],

  /**
   * Monokai — adapted to a 16-color pixel art palette
   * Dark tones with editor-inspired accent colors.
   */
  monokai: [
    [39, 40, 34],   [75, 70, 58],   [117, 113, 94], [166, 162, 140],
    [248, 248, 242],[249, 38, 114], [102, 217, 239],[166, 226, 46],
    [253, 151, 31], [174, 129, 255],[104, 206, 220],[190, 6, 64],
    [63, 160, 7],   [134, 95, 24],  [33, 109, 162], [117, 80, 194],
  ],
}

// ─── Utility: Euclidean RGB distance ─────────────────────────────────────────

function colorDistance(a: RGB, b: RGB): number {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  return dr * dr + dg * dg + db * db // no sqrt needed — we only compare
}

function nearestColor(pixel: RGB, palette: RGB[]): RGB {
  let best = palette[0]
  let bestDist = colorDistance(pixel, best)
  for (let i = 1; i < palette.length; i++) {
    const d = colorDistance(pixel, palette[i])
    if (d < bestDist) {
      bestDist = d
      best = palette[i]
    }
  }
  return best
}

// ─── Step 1: Grid Snapping (nearest-neighbor resize) ─────────────────────────

/**
 * Downsample `inputBuffer` to `targetSize × targetSize` using nearest-neighbor
 * interpolation. Sharp's `kernel: 'nearest'` gives us hard pixel edges with
 * zero bleeding — identical to what pixie.haus and aseprite export does.
 *
 * Alpha channel is preserved (transparent PNGs remain transparent).
 */
export async function gridSnap(
  inputBuffer: Buffer,
  targetSize: number
): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize(targetSize, targetSize, {
      kernel: "nearest",     // NO bilinear, NO lanczos — hard pixels only
      fit: "fill",           // exact output dimensions
    })
    .ensureAlpha()           // keep/add alpha channel
    .raw()                   // get raw RGBA bytes for quantization
    .toBuffer({ resolveWithObject: true })
    .then(({ data }) => data)
}

// ─── Step 2: Color Quantization ───────────────────────────────────────────────

/**
 * Walk every pixel in a raw RGBA buffer and replace its RGB with the
 * nearest palette color. Alpha < 10 pixels are kept fully transparent.
 *
 * @param rawBuffer   Raw RGBA buffer (width*height*4 bytes)
 * @param targetSize  Width/height in pixels
 * @param paletteName Key of PALETTES object (falls back to "default")
 * @returns           PNG-encoded Buffer with quantized colors
 */
export async function quantizeColors(
  rawBuffer: Buffer,
  targetSize: number,
  paletteName: string
): Promise<Buffer> {
  const palette = PALETTES[paletteName] ?? PALETTES["default"]
  const data = Buffer.from(rawBuffer) // mutable copy
  const total = targetSize * targetSize

  for (let i = 0; i < total; i++) {
    const offset = i * 4
    const alpha = data[offset + 3]

    // Fully transparent pixel — leave as-is
    if (alpha < 10) {
      data[offset]     = 0
      data[offset + 1] = 0
      data[offset + 2] = 0
      data[offset + 3] = 0
      continue
    }

    // Semi-transparent pixels → snap to fully opaque (pixel art has no anti-aliasing)
    const pixel: RGB = [data[offset], data[offset + 1], data[offset + 2]]
    const nearest = nearestColor(pixel, palette)

    data[offset]     = nearest[0]
    data[offset + 1] = nearest[1]
    data[offset + 2] = nearest[2]
    data[offset + 3] = 255  // fully opaque
  }

  // Re-encode as PNG from raw RGBA buffer
  return sharp(data, {
    raw: {
      width: targetSize,
      height: targetSize,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 }) // max compression, lossless
    .toBuffer()
}

// ─── Main export: full pipeline ───────────────────────────────────────────────

/**
 * Full post-processing pipeline:
 *  URL → download → grid snap → color quantize → PNG Buffer → base64 data URL
 *
 * @param imageUrl    URL of the fal.ai-generated image
 * @param targetSize  Output sprite dimension (e.g. 64 for 64×64)
 * @param paletteName Palette key (default, gameboy, nes, snes, pico8, endesga32, monokai)
 * @returns           `data:image/png;base64,...` string ready for <img> or download
 */
export async function pixelProcess(
  imageUrl: string,
  targetSize: number,
  paletteName: string
): Promise<string> {
  // 1. Download the AI-generated image as a buffer
  const fetchRes = await fetch(imageUrl)
  if (!fetchRes.ok) {
    throw new Error(`Failed to download generated image: ${fetchRes.status}`)
  }
  const arrayBuffer = await fetchRes.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  // 2. Grid snap — nearest-neighbor resize to target sprite size
  //    Returns raw RGBA buffer
  const snappedRaw = await gridSnap(inputBuffer, targetSize)

  // 3. Color quantize — clamp every pixel to nearest palette color
  //    Returns final PNG buffer
  const pngBuffer = await quantizeColors(snappedRaw, targetSize, paletteName)

  // 4. Encode as base64 data URL
  const base64 = pngBuffer.toString("base64")
  return `data:image/png;base64,${base64}`
}

// ─── Palette list (for API validation) ───────────────────────────────────────
export const VALID_PALETTES = Object.keys(PALETTES)
