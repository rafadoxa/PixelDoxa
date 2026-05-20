import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { pixelProcess } from "@/lib/pixel-process"

// Configure fal client with server-side key
fal.config({ credentials: process.env.FAL_KEY })

// Map user-facing sizes to generation sizes
// We generate at a high resolution, then downsample with nearest-neighbor
const SIZE_MAP: Record<string, { gen: number; out: number }> = {
  "16x16":   { gen: 512,  out: 16  },
  "32x32":   { gen: 512,  out: 32  },
  "64x64":   { gen: 512,  out: 64  },
  "128x128": { gen: 768,  out: 128 },
  "256x256": { gen: 1024, out: 256 },
}

// Prompt hints per palette (reinforce color constraints in the prompt)
const PALETTE_PROMPTS: Record<string, string> = {
  "default":   "pixel art sprite, clean pixel art style, game asset",
  "gameboy":   "gameboy palette, 4 colors, green monochrome tones, pixel art",
  "nes":       "NES palette, retro 8-bit pixel art, limited colors",
  "snes":      "SNES 16-bit pixel art, vibrant colors, classic RPG style",
  "pico8":     "PICO-8 palette, 16 colors, retro pixel art",
  "endesga32": "pixel art, 32 color palette, indie game style",
  "monokai":   "dark pixel art, monokai colors, cyberpunk style",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      prompt,
      size = "64x64",
      palette = "default",
      style = "character",
      removeBackground = true,
    } = body

    if (!prompt || prompt.trim().length < 2) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    const sizeConfig = SIZE_MAP[size] || SIZE_MAP["64x64"]
    const palettePrompt = PALETTE_PROMPTS[palette] || PALETTE_PROMPTS["default"]

    // Build pixel art optimized prompt
    const styleMap: Record<string, string> = {
      character: "character sprite, front-facing, idle pose, centered",
      item:      "item sprite, object, centered, clean edges",
      tile:      "tileset tile, seamless, top-down view",
      enemy:     "enemy sprite, game character, menacing, centered",
      npc:       "NPC character sprite, friendly, game asset",
      icon:      "icon, small sprite, symbolic, clear silhouette",
    }
    const stylePrompt = styleMap[style] || styleMap["character"]

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

    // ── Step 1: Generate with fal.ai Flux Schnell ────────────────────────────
    const result = await fal.run("fal-ai/flux/schnell", {
      input: {
        prompt: fullPrompt,
        negative_prompt: negativePrompt,
        image_size: {
          width: sizeConfig.gen,
          height: sizeConfig.gen,
        },
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: false,
      },
    }) as { images: Array<{ url: string; content_type: string }> }

    if (!result.images || result.images.length === 0) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      )
    }

    const generatedImageUrl = result.images[0].url

    // ── Step 2: Optional background removal ─────────────────────────────────
    // Run BEFORE pixel processing so bria-rmbg works on the full-res image
    // (background removal on a 16px sprite would be unreliable)
    let imageUrlForProcessing = generatedImageUrl
    if (removeBackground) {
      try {
        const bgResult = await fal.run("fal-ai/bria/background/remove", {
          input: {
            image_url: generatedImageUrl,
          },
        }) as { image: { url: string } }
        if (bgResult.image?.url) {
          imageUrlForProcessing = bgResult.image.url
        }
      } catch (bgError) {
        // Background removal failed — continue with original
        console.warn("Background removal failed, using original:", bgError)
      }
    }

    // ── Step 3: Grid Snapping + Color Quantization ───────────────────────────
    // Download → nearest-neighbor resize → palette clamp → PNG base64
    let finalImageUrl: string
    try {
      finalImageUrl = await pixelProcess(
        imageUrlForProcessing,
        sizeConfig.out,   // e.g. 64 for "64x64"
        palette           // e.g. "pico8"
      )
    } catch (processError) {
      // If post-processing fails, fall back to the raw URL
      console.warn("Pixel processing failed, returning raw URL:", processError)
      finalImageUrl = imageUrlForProcessing
    }

    return NextResponse.json({
      success: true,
      imageUrl: finalImageUrl,         // processed base64 PNG (or fallback URL)
      originalUrl: generatedImageUrl,  // raw fal.ai URL (for debugging)
      prompt: fullPrompt,
      size: size,
      palette: palette,
      processed: finalImageUrl.startsWith("data:"), // true = grid snap + quantize applied
    })

  } catch (error: unknown) {
    console.error("Generation error:", error)
    const message = error instanceof Error ? error.message : "Generation failed"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
