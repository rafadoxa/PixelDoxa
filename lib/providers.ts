/**
 * lib/providers.ts
 * 
 * Hybrid AI image generation providers for PixelDoxa:
 * 
 *  FREE tier  → Pollinations.ai (Flux Schnell, 100% free, no key, ~15-30s)
 *  PRO tier   → fal.ai (Flux Schnell, paid, ~3-5s, background removal)
 * 
 * Both providers return a public image URL that feeds into the
 * pixel-process pipeline (grid snap + color quantization).
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type Tier = "free" | "pro"

export interface GenerateOptions {
  prompt:        string
  negativePrompt?: string
  width:         number
  height:        number
  steps:         number
}

export interface GenerateResult {
  imageUrl:    string   // public https:// URL
  provider:    string
  durationMs?: number
}

// ── FREE Provider: Pollinations.ai ─────────────────────────────────────────
// Docs: https://pollinations.ai/
// Rate limits: generous, no account needed
// Models: flux, flux-schnell, turbo (all free)
// Returns: JPEG image directly from URL

export async function generateFree(opts: GenerateOptions): Promise<GenerateResult> {
  const t0 = Date.now()

  // Pollinations GET endpoint — prompt goes in the URL path
  const encoded = encodeURIComponent(opts.prompt)

  // Try flux-schnell first, fallback to flux
  const url = [
    `https://image.pollinations.ai/prompt/${encoded}`,
    `?width=${opts.width}`,
    `&height=${opts.height}`,
    `&model=flux-schnell`,
    `&nologo=true`,
    `&nofeed=true`,           // don't add to public feed
    `&seed=${Math.floor(Math.random() * 999999)}`, // different result each time
  ].join("")

  // Pollinations streams the image — we just need to confirm it's reachable
  // The URL itself IS the image, no JSON wrapper
  const res = await fetch(url, {
    method: "GET",
    headers: { "Accept": "image/*" },
    // Next.js server: no cache (always fresh)
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Pollinations error: ${res.status} ${res.statusText}`)
  }

  const contentType = res.headers.get("content-type") || ""
  if (!contentType.startsWith("image/")) {
    const text = await res.text()
    throw new Error(`Pollinations returned non-image: ${text.slice(0, 100)}`)
  }

  return {
    imageUrl:   url,      // Pollinations URL is stable and publicly accessible
    provider:   "pollinations",
    durationMs: Date.now() - t0,
  }
}

// ── PRO Provider: fal.ai ───────────────────────────────────────────────────
// Docs: https://fal.ai/models/fal-ai/flux/schnell
// Requires: FAL_KEY environment variable
// Returns: { images: [{ url }] }

export async function generatePro(
  opts:        GenerateOptions,
  falClient:   { run: (model: string, opts: object) => Promise<unknown> }
): Promise<GenerateResult> {
  const t0 = Date.now()

  const result = await falClient.run("fal-ai/flux/schnell", {
    input: {
      prompt:               opts.prompt,
      negative_prompt:      opts.negativePrompt ?? "",
      image_size: {
        width:  opts.width,
        height: opts.height,
      },
      num_inference_steps:  opts.steps,
      num_images:           1,
      enable_safety_checker: false,
    },
  }) as { images: Array<{ url: string }> }

  if (!result.images?.[0]?.url) {
    throw new Error("fal.ai returned no images")
  }

  return {
    imageUrl:   result.images[0].url,
    provider:   "fal.ai",
    durationMs: Date.now() - t0,
  }
}

// ── Background removal ─────────────────────────────────────────────────────
// Free:  rembg via Pollinations-compatible open endpoint (remove.bg free tier)
//        Fallback: skip (return original)
// Pro:   fal.ai bria-rmbg (paid, best quality)

export async function removeBackgroundFree(imageUrl: string): Promise<string> {
  // Use remove.bg free API (50 calls/month free with account key)
  // If no key configured, use PhotoRoom's free endpoint as fallback
  // For now: skip background removal on free tier — return as-is
  // The pixel quantization already handles clean edges for small sprites
  return imageUrl
}

export async function removeBackgroundPro(
  imageUrl: string,
  falClient: { run: (model: string, opts: object) => Promise<unknown> }
): Promise<string> {
  try {
    const result = await falClient.run("fal-ai/bria/background/remove", {
      input: { image_url: imageUrl },
    }) as { image: { url: string } }
    return result.image?.url ?? imageUrl
  } catch {
    console.warn("fal.ai background removal failed, using original")
    return imageUrl
  }
}
