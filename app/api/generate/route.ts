/**
 * POST /api/generate
 *
 * Hybrid pixel art generation pipeline:
 *
 *  tier: "free"  → Pollinations.ai (Flux Schnell, 100% free, no credits needed)
 *  tier: "pro"   → fal.ai (Flux Schnell, paid, faster + background removal)
 *
 * Shared post-processing (both tiers):
 *  1. Nearest-neighbor resize  → target sprite size (16–256 px)
 *  2. Color quantization       → clamp every pixel to palette
 *  3. Return base64 PNG data URL
 */

import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { pixelProcess } from "@/lib/pixel-process"
import {
  generateFree,
  generatePro,
  removeBackgroundFree,
  removeBackgroundPro,
  type Tier,
} from "@/lib/providers"

// Configure fal.ai (only used for pro tier)
fal.config({ credentials: process.env.FAL_KEY })

// ── Size map ───────────────────────────────────────────────────────────────
// We generate at higher resolution then nearest-neighbor downsample
const SIZE_MAP: Record<string, { gen: number; out: number }> = {
  "16x16":   { gen: 512,  out: 16  },
  "32x32":   { gen: 512,  out: 32  },
  "64x64":   { gen: 512,  out: 64  },
  "128x128": { gen: 768,  out: 128 },
  "256x256": { gen: 1024, out: 256 },
}

// ── Palette prompt hints ───────────────────────────────────────────────────
const PALETTE_PROMPTS: Record<string, string> = {
  "default":   "pixel art sprite, clean pixel art style, game asset",
  "gameboy":   "gameboy palette, 4 colors, green monochrome tones, pixel art",
  "nes":       "NES palette, retro 8-bit pixel art, limited colors",
  "snes":      "SNES 16-bit pixel art, vibrant colors, classic RPG style",
  "pico8":     "PICO-8 palette, 16 colors, retro pixel art",
  "endesga32": "pixel art, 32 color palette, indie game style",
  "monokai":   "dark pixel art, monokai colors, cyberpunk style",
}

// ── Style prompt hints ─────────────────────────────────────────────────────
const STYLE_MAP: Record<string, string> = {
  character: "character sprite, front-facing, idle pose, centered",
  item:      "item sprite, object, centered, clean edges",
  tile:      "tileset tile, seamless, top-down view",
  enemy:     "enemy sprite, game character, menacing, centered",
  npc:       "NPC character sprite, friendly, game asset",
  icon:      "icon, small sprite, symbolic, clear silhouette",
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      prompt,
      size             = "64x64",
      palette          = "default",
      style            = "character",
      removeBackground = true,
      tier             = "free",      // "free" | "pro"
    } = body

    // ── Validate ──────────────────────────────────────────────────────────
    if (!prompt || prompt.trim().length < 2) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }
    if (!["free", "pro"].includes(tier)) {
      return NextResponse.json({ error: "tier must be 'free' or 'pro'" }, { status: 400 })
    }

    const sizeConfig    = SIZE_MAP[size]    ?? SIZE_MAP["64x64"]
    const palettePrompt = PALETTE_PROMPTS[palette] ?? PALETTE_PROMPTS["default"]
    const stylePrompt   = STYLE_MAP[style]  ?? STYLE_MAP["character"]

    // ── Build prompt ──────────────────────────────────────────────────────
    const fullPrompt = [
      prompt,
      stylePrompt,
      palettePrompt,
      "pixel art, no anti-aliasing, crisp edges, transparent background",
      "game ready asset, low resolution, retro style",
    ].join(", ")

    const negativePrompt = [
      "blurry, anti-aliasing, smooth gradients, photorealistic",
      "3d render, painting, watercolor, sketch",
      "high resolution, detailed texture, noise, grain",
    ].join(", ")

    const genOptions = {
      prompt:         fullPrompt,
      negativePrompt,
      width:          sizeConfig.gen,
      height:         sizeConfig.gen,
      steps:          4,
    }

    // ── Step 1: Generate image ────────────────────────────────────────────
    let genResult: { imageUrl: string; provider: string; durationMs?: number }

    if ((tier as Tier) === "pro") {
      // PRO: fal.ai Flux Schnell (~3-5s, requires FAL_KEY with balance)
      if (!process.env.FAL_KEY) {
        return NextResponse.json(
          { error: "Pro tier requires FAL_KEY — configure in Vercel environment variables" },
          { status: 503 }
        )
      }
      genResult = await generatePro(genOptions, fal)
    } else {
      // FREE: Pollinations.ai Flux Schnell (~15-30s, no key needed)
      genResult = await generateFree(genOptions)
    }

    const generatedImageUrl = genResult.imageUrl

    // ── Step 2: Background removal ────────────────────────────────────────
    // Pro tier: bria-rmbg (fal.ai, high quality)
    // Free tier: skip (no free bg removal service reliable enough)
    // NOTE: We do bg removal BEFORE downsampling — better quality at full res
    let imageForProcessing = generatedImageUrl

    if (removeBackground) {
      if ((tier as Tier) === "pro") {
        imageForProcessing = await removeBackgroundPro(generatedImageUrl, fal)
      } else {
        imageForProcessing = await removeBackgroundFree(generatedImageUrl)
      }
    }

    // ── Step 3: Grid snap + color quantization ────────────────────────────
    // nearest-neighbor resize → target sprite size
    // clamp every pixel to nearest palette color
    let finalImageUrl: string
    try {
      finalImageUrl = await pixelProcess(
        imageForProcessing,
        sizeConfig.out,
        palette
      )
    } catch (processError) {
      console.warn("Pixel processing failed, returning raw:", processError)
      finalImageUrl = imageForProcessing
    }

    // ── Response ──────────────────────────────────────────────────────────
    return NextResponse.json({
      success:          true,
      imageUrl:         finalImageUrl,
      originalUrl:      generatedImageUrl,
      prompt:           fullPrompt,
      size,
      palette,
      tier,
      provider:         genResult.provider,
      processed:        finalImageUrl.startsWith("data:"),
      generationMs:     genResult.durationMs,
    })

  } catch (error: unknown) {
    console.error("Generation error:", error)
    const message = error instanceof Error ? error.message : "Generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
