"use client"

/**
 * TruePixel — "Drop any image → pixel art"
 *
 * Features:
 *  - Drag-and-drop / click-to-upload any image (PNG, JPG, WebP, GIF, SVG)
 *  - Paste from clipboard (Ctrl/Cmd+V)
 *  - Import from URL
 *  - Live settings panel: pixel size, palette, dither, contrast, saturation, outline
 *  - Instant before/after comparison (slider divider OR side-by-side)
 *  - Auto-reprocess on settings change (debounced 400ms)
 *  - Export: true-size PNG (pixel art) + upscaled PNG + copy to clipboard
 *  - Preset gallery: 6 tuned presets for different source types
 *  - Custom palette builder: add/remove hex colors
 *  - Pixel size live ruler showing actual canvas size
 */

import {
  useState, useRef, useCallback, useEffect, useMemo,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload, Download, RefreshCw, Copy, Check,
  Sliders, Palette, Eye, Zap, ChevronRight,
  Link2, Clipboard, X, Info, SlidersHorizontal,
  ImageIcon, Sparkles, Crown, Wand2, Plus, Trash2,
  Maximize2, Minimize2, ArrowLeftRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

// ── Types ──────────────────────────────────────────────────────────────────

type ViewMode  = "sidebyside" | "slider" | "original" | "result"
type DitherMode = "none" | "floyd"

interface ConvertSettings {
  pixelSize:     number
  palette:       string
  customPalette: string[]
  dither:        boolean
  contrastBoost: number
  saturation:    number
  upscalePreview: number
  outline:       boolean
  outlineColor:  string
}

interface ConvertResult {
  previewDataUrl: string
  trueDataUrl:    string
  pixelSize:      number
  previewSize:    number
  palette:        string
  processingMs:   number
}

// ── Palette data ───────────────────────────────────────────────────────────

const PALETTE_LIST = [
  { id: "none",      name: "None",       sub: "Original colors",        colors: [] },
  { id: "default",   name: "Sweetie 16", sub: "16 balanced colors",     colors: ["#1a1c2c","#5d275d","#b13e53","#ef7d57","#ffcd75","#a7f070","#38b764","#257179"] },
  { id: "pico8",     name: "PICO-8",     sub: "16 punchy colors",       colors: ["#000000","#1d2b53","#7e2553","#008751","#ab5236","#5f574f","#c2c3c7","#fff1e8"] },
  { id: "gameboy",   name: "Game Boy",   sub: "4 green shades",         colors: ["#0f380f","#306230","#8bac0f","#9bbc0f"] },
  { id: "nes",       name: "NES",        sub: "40 hardware colors",     colors: ["#7c7c7c","#0000fc","#0078f8","#fcbcb0","#f8d878","#00b800","#00a800","#00a844"] },
  { id: "snes",      name: "SNES",       sub: "32 vibrant colors",      colors: ["#000000","#f8f8f8","#6888fc","#fc7088","#7c7cfc","#a800a8","#fca400","#f83800"] },
  { id: "endesga32", name: "Endesga 32", sub: "32 indie colors",        colors: ["#be4a2f","#d77643","#ead4aa","#e4a672","#b86f50","#733e39","#3e2731","#a22633"] },
  { id: "monokai",   name: "Monokai",    sub: "16 editor-inspired",     colors: ["#272822","#75715e","#f8f8f2","#66d9e8","#a6e22e","#f92672","#fd971f","#ae81ff"] },
  { id: "grayscale", name: "Grayscale",  sub: "8 grey shades",          colors: ["#000000","#242424","#494949","#6d6d6d","#929292","#b6b6b6","#dbdbdb","#ffffff"] },
  { id: "cga",       name: "CGA",        sub: "16 retro PC colors",     colors: ["#000000","#00aaaa","#aa00aa","#aaaaaa","#000000","#00aa00","#aa0000","#aa5500"] },
  { id: "c64",       name: "C64",        sub: "16 Commodore 64 colors", colors: ["#000000","#ffffff","#880000","#aaffee","#cc44cc","#00cc55","#0000aa","#eeee77"] },
  { id: "custom",    name: "Custom",     sub: "Your own colors",        colors: [] },
]

// ── Preset configurations ─────────────────────────────────────────────────

interface Preset { label: string; labelPt: string; emoji: string; settings: Partial<ConvertSettings> }

const PRESETS: Preset[] = [
  {
    label: "Classic Sprite", labelPt: "Sprite Clássico", emoji: "🗡️",
    settings: { pixelSize: 32, palette: "default", dither: false, contrastBoost: 20, saturation: 1.4, outline: true },
  },
  {
    label: "Game Boy", labelPt: "Game Boy", emoji: "🎮",
    settings: { pixelSize: 48, palette: "gameboy", dither: true, contrastBoost: 30, saturation: 0.8, outline: false },
  },
  {
    label: "NES Style", labelPt: "Estilo NES", emoji: "👾",
    settings: { pixelSize: 32, palette: "nes", dither: false, contrastBoost: 15, saturation: 1.2, outline: true, outlineColor: "#000000" },
  },
  {
    label: "PICO-8", labelPt: "PICO-8", emoji: "🕹️",
    settings: { pixelSize: 64, palette: "pico8", dither: true, contrastBoost: 10, saturation: 1.6, outline: false },
  },
  {
    label: "Cinematic", labelPt: "Cinemático", emoji: "🎬",
    settings: { pixelSize: 128, palette: "none", dither: false, contrastBoost: 25, saturation: 0.9, outline: false },
  },
  {
    label: "Demoscene", labelPt: "Demoscene", emoji: "💾",
    settings: { pixelSize: 16, palette: "c64", dither: true, contrastBoost: 40, saturation: 1.8, outline: false },
  },
]

// ── Debounce hook ─────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ── Component ──────────────────────────────────────────────────────────────

export function TruePixel() {
  const { lang } = useLanguage()

  // Source image
  const [sourceImage, setSourceImage]     = useState<string | null>(null)
  const [sourceName, setSourceName]       = useState("")
  const [sourceDims, setSourceDims]       = useState<{ w: number; h: number } | null>(null)
  const [isDragging, setIsDragging]       = useState(false)

  // URL import
  const [showUrlInput, setShowUrlInput]   = useState(false)
  const [urlInput, setUrlInput]           = useState("")
  const [urlError, setUrlError]           = useState("")

  // Conversion result
  const [result, setResult]               = useState<ConvertResult | null>(null)
  const [isConverting, setIsConverting]   = useState(false)
  const [convertError, setConvertError]   = useState<string | null>(null)

  // Settings
  const [settings, setSettings]           = useState<ConvertSettings>({
    pixelSize:      64,
    palette:        "default",
    customPalette:  [],
    dither:         false,
    contrastBoost:  0,
    saturation:     1.0,
    upscalePreview: 4,
    outline:        false,
    outlineColor:   "#000000",
  })

  // UI
  const [viewMode, setViewMode]           = useState<ViewMode>("sidebyside")
  const [sliderPos, setSliderPos]         = useState(50)        // % for comparison slider
  const [zoom, setZoom]                   = useState(1)
  const [copied, setCopied]               = useState(false)
  const [newHexColor, setNewHexColor]     = useState("#ff0000")
  const [autoProcess, setAutoProcess]     = useState(true)

  const fileInputRef  = useRef<HTMLInputElement>(null)
  const sliderDivRef  = useRef<HTMLDivElement>(null)
  const isDraggingSlider = useRef(false)

  // Debounce settings so we don't hit the API on every slider tick
  const debouncedSettings = useDebounce(settings, 400)

  // ── Auto-reprocess when settings change ────────────────────────────────
  useEffect(() => {
    if (autoProcess && sourceImage) {
      handleConvert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSettings, sourceImage])

  // ── Clipboard paste (Ctrl/Cmd+V) ───────────────────────────────────────
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? [])
      const imageItem = items.find((it) => it.type.startsWith("image/"))
      if (!imageItem) return
      const file = imageItem.getAsFile()
      if (!file) return
      loadFile(file)
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Load source dims once image is set ─────────────────────────────────
  useEffect(() => {
    if (!sourceImage) return
    const img = new window.Image()
    img.onload = () => setSourceDims({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = sourceImage
  }, [sourceImage])

  // ── File loader ─────────────────────────────────────────────────────────
  const loadFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSourceImage(e.target?.result as string)
      setSourceName(file.name)
      setResult(null)
      setConvertError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  // ── Drag handlers ───────────────────────────────────────────────────────
  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const onDragLeave = useCallback(() => setIsDragging(false), [])
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) { loadFile(file); return }
    // Try URL drop
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain")
    if (url?.startsWith("http")) {
      setSourceImage(url)
      setSourceName(url.split("/").pop() ?? "image")
      setResult(null)
    }
  }, [loadFile])

  // ── URL import ──────────────────────────────────────────────────────────
  const importFromUrl = useCallback(async () => {
    setUrlError("")
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith("http")) { setUrlError(lang === "pt" ? "URL inválida" : "Invalid URL"); return }
    setSourceImage(url)
    setSourceName(url.split("/").pop() ?? "image")
    setResult(null)
    setShowUrlInput(false)
    setUrlInput("")
  }, [urlInput, lang])

  // ── Convert ─────────────────────────────────────────────────────────────
  const handleConvert = useCallback(async () => {
    if (!sourceImage) return
    setIsConverting(true)
    setConvertError(null)

    try {
      const res = await fetch("/api/pixel-convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl:       sourceImage,
          pixelSize:      settings.pixelSize,
          palette:        settings.palette,
          customPalette:  settings.customPalette,
          dither:         settings.dither,
          contrastBoost:  settings.contrastBoost,
          saturation:     settings.saturation,
          upscalePreview: settings.upscalePreview,
          outline:        settings.outline,
          outlineColor:   settings.outlineColor,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Conversion failed")
      setResult(data as ConvertResult)
    } catch (err: unknown) {
      setConvertError(err instanceof Error ? err.message : "Conversion failed")
    } finally {
      setIsConverting(false)
    }
  }, [sourceImage, settings])

  // ── Apply preset ────────────────────────────────────────────────────────
  const applyPreset = useCallback((preset: Preset) => {
    setSettings((prev) => ({ ...prev, ...preset.settings }))
  }, [])

  // ── Update single setting ───────────────────────────────────────────────
  const set = useCallback(<K extends keyof ConvertSettings>(key: K, value: ConvertSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  // ── Download ─────────────────────────────────────────────────────────────
  const downloadTrue = () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result.trueDataUrl
    a.download = `truepixel_${result.pixelSize}px_${settings.palette}.png`
    a.click()
  }

  const downloadPreview = () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result.previewDataUrl
    a.download = `truepixel_preview_${result.previewSize}px.png`
    a.click()
  }

  const copyToClipboard = async () => {
    if (!result) return
    try {
      const res = await fetch(result.previewDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: copy data URL text
      await navigator.clipboard.writeText(result.previewDataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ── Comparison slider mouse handling ────────────────────────────────────
  const onSliderMouseDown = (e: React.MouseEvent) => {
    isDraggingSlider.current = true
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingSlider.current || !sliderDivRef.current) return
      const rect = sliderDivRef.current.getBoundingClientRect()
      const pct  = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      setSliderPos(pct)
    }
    const onUp = () => { isDraggingSlider.current = false }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  // ── Custom palette helpers ───────────────────────────────────────────────
  const addCustomColor = () => {
    if (settings.customPalette.includes(newHexColor)) return
    set("customPalette", [...settings.customPalette, newHexColor])
  }
  const removeCustomColor = (hex: string) => {
    set("customPalette", settings.customPalette.filter((c) => c !== hex))
  }

  // ── Selected palette data ────────────────────────────────────────────────
  const selectedPalette = useMemo(
    () => PALETTE_LIST.find((p) => p.id === settings.palette) ?? PALETTE_LIST[0],
    [settings.palette]
  )

  // ── Pixel size ruler text ────────────────────────────────────────────────
  const previewSizeLabel = `${settings.pixelSize}×${settings.pixelSize}px → ${settings.pixelSize * settings.upscalePreview}×${settings.pixelSize * settings.upscalePreview}px`

  // ── Checkerboard bg style (transparency indicator) ─────────────────────
  const checkerBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23333'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23333'/%3E%3Crect x='8' width='8' height='8' fill='%23222'/%3E%3Crect y='8' width='8' height='8' fill='%23222'/%3E%3C/svg%3E")`,
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            True Pixel
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "pt"
              ? "Arraste qualquer imagem e converta para pixel art — sem precisar de prompt"
              : "Drop any image and convert it to pixel art — no prompt needed"}
          </p>
        </div>
        {result && (
          <div className="text-right text-xs text-muted-foreground">
            <p className="text-accent font-medium">{result.pixelSize}×{result.pixelSize}px</p>
            <p>{result.processingMs}ms · {result.palette}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">

        {/* ════════════ LEFT: Settings Panel ════════════ */}
        <div className="space-y-4">

          {/* ── Drop Zone ── */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !sourceImage && fileInputRef.current?.click()}
            className={cn(
              "relative rounded-xl border-2 transition-all overflow-hidden",
              isDragging
                ? "border-accent bg-accent/10 scale-[1.01]"
                : sourceImage
                  ? "border-accent/30 bg-card cursor-default"
                  : "border-dashed border-border hover:border-accent/50 hover:bg-accent/5 cursor-pointer"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f) }}
            />

            {sourceImage ? (
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">{sourceName}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                      className="text-[10px] px-2 py-0.5 rounded border border-border hover:border-accent/40 text-muted-foreground hover:text-accent transition-all"
                    >
                      {lang === "pt" ? "Trocar" : "Change"}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSourceImage(null); setResult(null) }}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceImage}
                  alt="Source"
                  className="w-full rounded-lg object-contain max-h-40"
                  style={{ imageRendering: "pixelated" }}
                />
                {sourceDims && (
                  <p className="text-[10px] text-center text-muted-foreground">
                    {sourceDims.w}×{sourceDims.h}px → {settings.pixelSize}×{settings.pixelSize}px
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center gap-3 text-center px-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Upload className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {lang === "pt" ? "Arraste ou clique" : "Drag or click"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PNG · JPG · WebP · GIF · SVG
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 text-[10px] text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-full border border-border bg-secondary/50">Ctrl+V</span>
                  <span className="px-2 py-0.5 rounded-full border border-border bg-secondary/50">{lang === "pt" ? "Cole da área de transferência" : "Paste clipboard"}</span>
                </div>
              </div>
            )}

            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-accent/10 pointer-events-none">
                <p className="text-accent font-bold text-lg">
                  {lang === "pt" ? "Solte aqui!" : "Drop here!"}
                </p>
              </div>
            )}
          </div>

          {/* ── URL import ── */}
          <div>
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors w-full"
            >
              <Link2 className="w-3.5 h-3.5" />
              {lang === "pt" ? "Importar por URL" : "Import from URL"}
              <ChevronRight className={cn("w-3 h-3 ml-auto transition-transform", showUrlInput && "rotate-90")} />
            </button>

            <AnimatePresence>
              {showUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2 overflow-hidden"
                >
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && importFromUrl()}
                    placeholder="https://..."
                    className="w-full h-8 px-3 rounded-lg bg-secondary/50 border border-border text-xs focus:outline-none focus:border-accent/50"
                  />
                  {urlError && <p className="text-xs text-destructive">{urlError}</p>}
                  <Button size="sm" onClick={importFromUrl} className="w-full h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">
                    {lang === "pt" ? "Importar" : "Import"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Presets ── */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              {lang === "pt" ? "Presets" : "Presets"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-accent/40 hover:bg-accent/5 text-left transition-all"
                >
                  <span className="text-sm">{preset.emoji}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {lang === "pt" ? preset.labelPt : preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Settings ── */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-5">
            <p className="text-xs font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
              {lang === "pt" ? "Configurações" : "Settings"}
            </p>

            {/* Pixel size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{lang === "pt" ? "Resolução em pixels" : "Pixel resolution"}</Label>
                <span className="text-[10px] font-mono text-accent">{settings.pixelSize}px</span>
              </div>
              <Slider
                min={8} max={256} step={8}
                value={[settings.pixelSize]}
                onValueChange={([v]) => set("pixelSize", v)}
              />
              <div className="flex justify-between text-[9px] text-muted-foreground/50">
                {[8,16,32,64,128,256].map((s) => (
                  <button key={s} onClick={() => set("pixelSize", s)}
                    className={cn("hover:text-accent transition-colors", settings.pixelSize === s && "text-accent font-bold")}
                  >{s}</button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center">{previewSizeLabel}</p>
            </div>

            {/* Palette */}
            <div className="space-y-2">
              <Label className="text-xs">{lang === "pt" ? "Paleta de cores" : "Color palette"}</Label>
              <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {PALETTE_LIST.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => set("palette", p.id)}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all",
                      settings.palette === p.id
                        ? "border-accent/50 bg-accent/10"
                        : "border-border bg-secondary/20 hover:border-muted-foreground/40"
                    )}
                  >
                    {p.colors.length > 0 && (
                      <div className="flex gap-0.5 mb-1">
                        {p.colors.slice(0, 6).map((c, i) => (
                          <div key={i} className="h-2.5 flex-1 rounded-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    )}
                    <p className={cn("text-[10px] font-medium", settings.palette === p.id ? "text-accent" : "text-muted-foreground")}>
                      {p.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground/60">{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom palette editor */}
            <AnimatePresence>
              {settings.palette === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label className="text-xs">{lang === "pt" ? "Cores personalizadas" : "Custom colors"}</Label>
                  <div className="flex flex-wrap gap-1">
                    {settings.customPalette.map((hex) => (
                      <div key={hex} className="relative group">
                        <div
                          className="w-7 h-7 rounded border-2 border-border cursor-pointer hover:border-accent/50 transition-all"
                          style={{ backgroundColor: hex }}
                          onClick={() => removeCustomColor(hex)}
                          title={lang === "pt" ? "Clique para remover" : "Click to remove"}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3 text-white drop-shadow" />
                        </div>
                      </div>
                    ))}
                    {settings.customPalette.length === 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {lang === "pt" ? "Adicione cores abaixo" : "Add colors below"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newHexColor}
                      onChange={(e) => setNewHexColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent"
                    />
                    <input
                      type="text"
                      value={newHexColor}
                      onChange={(e) => setNewHexColor(e.target.value)}
                      className="flex-1 h-8 px-2 rounded bg-secondary/50 border border-border text-xs font-mono"
                      placeholder="#ff0000"
                    />
                    <Button size="sm" onClick={addCustomColor} className="h-8 px-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dithering */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">{lang === "pt" ? "Dithering Floyd-Steinberg" : "Floyd-Steinberg Dithering"}</p>
                <p className="text-[10px] text-muted-foreground">
                  {lang === "pt" ? "Difusão de erro para gradientes suaves" : "Error diffusion for smooth gradients"}
                </p>
              </div>
              <button
                onClick={() => set("dither", !settings.dither)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0",
                  settings.dither ? "bg-accent" : "bg-secondary border border-border"
                )}
              >
                <motion.div
                  animate={{ x: settings.dither ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </button>
            </div>

            {/* Contrast boost */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{lang === "pt" ? "Boost de contraste" : "Contrast boost"}</Label>
                <span className="text-[10px] font-mono text-accent">+{settings.contrastBoost}%</span>
              </div>
              <Slider
                min={0} max={100} step={5}
                value={[settings.contrastBoost]}
                onValueChange={([v]) => set("contrastBoost", v)}
              />
              <p className="text-[10px] text-muted-foreground">
                {lang === "pt" ? "Aplicado antes do downscale — destaca bordas" : "Applied before downscale — sharpens edges"}
              </p>
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{lang === "pt" ? "Saturação" : "Saturation"}</Label>
                <span className="text-[10px] font-mono text-accent">{settings.saturation.toFixed(1)}×</span>
              </div>
              <Slider
                min={0.2} max={3.0} step={0.1}
                value={[settings.saturation]}
                onValueChange={([v]) => set("saturation", parseFloat(v.toFixed(1)))}
              />
              <div className="flex justify-between text-[9px] text-muted-foreground/50">
                <span>{lang === "pt" ? "Cinza" : "Gray"}</span>
                <span>1.0×</span>
                <span>{lang === "pt" ? "Vibrante" : "Vivid"}</span>
              </div>
            </div>

            {/* Outline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{lang === "pt" ? "Contorno 1px" : "1px Outline"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {lang === "pt" ? "Adiciona borda escura ao redor dos pixels" : "Adds dark border around opaque pixels"}
                  </p>
                </div>
                <button
                  onClick={() => set("outline", !settings.outline)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0",
                    settings.outline ? "bg-accent" : "bg-secondary border border-border"
                  )}
                >
                  <motion.div
                    animate={{ x: settings.outline ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
              </div>
              <AnimatePresence>
                {settings.outline && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <input
                      type="color"
                      value={settings.outlineColor}
                      onChange={(e) => set("outlineColor", e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.outlineColor}
                      onChange={(e) => set("outlineColor", e.target.value)}
                      className="flex-1 h-8 px-2 rounded bg-secondary/50 border border-border text-xs font-mono"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview upscale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{lang === "pt" ? "Escala da prévia" : "Preview scale"}</Label>
                <span className="text-[10px] font-mono text-accent">{settings.upscalePreview}×</span>
              </div>
              <div className="flex gap-1">
                {[2,4,6,8].map((s) => (
                  <button
                    key={s}
                    onClick={() => set("upscalePreview", s)}
                    className={cn(
                      "flex-1 py-1.5 rounded border text-[10px] font-medium transition-all",
                      settings.upscalePreview === s
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-accent/30"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-process toggle */}
            <div className="flex items-center justify-between py-1 border-t border-border pt-3">
              <div>
                <p className="text-xs font-medium">{lang === "pt" ? "Processar ao vivo" : "Live processing"}</p>
                <p className="text-[10px] text-muted-foreground">
                  {lang === "pt" ? "Reprocessa ao mudar configurações" : "Reprocesses on settings change"}
                </p>
              </div>
              <button
                onClick={() => setAutoProcess(!autoProcess)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0",
                  autoProcess ? "bg-emerald-500" : "bg-secondary border border-border"
                )}
              >
                <motion.div
                  animate={{ x: autoProcess ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </button>
            </div>
          </div>

          {/* ── Convert button ── */}
          <Button
            onClick={handleConvert}
            disabled={!sourceImage || isConverting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {lang === "pt" ? "Convertendo..." : "Converting..."}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                {lang === "pt" ? "Converter para Pixel Art" : "Convert to Pixel Art"}
              </>
            )}
          </Button>
          {convertError && (
            <p className="text-xs text-destructive text-center -mt-2">{convertError}</p>
          )}
        </div>

        {/* ════════════ RIGHT: Preview Panel ════════════ */}
        <div className="flex flex-col gap-4">

          {/* ── View mode selector + zoom ── */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-lg border border-border">
              {([
                { id: "sidebyside", icon: ArrowLeftRight, label: lang === "pt" ? "Lado a lado" : "Side by side" },
                { id: "slider",     icon: SlidersHorizontal, label: lang === "pt" ? "Comparar" : "Compare" },
                { id: "original",   icon: ImageIcon, label: lang === "pt" ? "Original" : "Original" },
                { id: "result",     icon: Sparkles,  label: lang === "pt" ? "Resultado" : "Result" },
              ] as { id: ViewMode; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  title={label}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all",
                    viewMode === id
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Export actions (only when result exists) */}
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? (lang === "pt" ? "Copiado!" : "Copied!") : (lang === "pt" ? "Copiar" : "Copy")}
                </button>
                <button
                  onClick={downloadTrue}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {result.pixelSize}px PNG
                </button>
                <Button
                  size="sm"
                  onClick={downloadPreview}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-8 px-3"
                >
                  <Download className="w-3 h-3 mr-1.5" />
                  {result.previewSize}px PNG
                </Button>
              </div>
            )}
          </div>

          {/* ── Main canvas area ── */}
          <div
            className="relative flex-1 min-h-[400px] rounded-xl border border-border overflow-hidden"
            style={checkerBg}
          >
            {/* Loading overlay */}
            <AnimatePresence>
              {isConverting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <RefreshCw className="w-7 h-7 text-accent animate-spin" />
                    </div>
                    <motion.div
                      className="absolute -inset-1 rounded-xl border-2 border-accent/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-sm font-medium text-accent">
                    {lang === "pt" ? "Convertendo para pixel art..." : "Converting to pixel art..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {settings.pixelSize}px · {settings.palette}{settings.dither ? " + dither" : ""}
                  </p>
                  {/* Animated pixel bar */}
                  <div className="flex gap-1">
                    {[0,1,2,3,4,5,6,7].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-sm bg-accent"
                        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!sourceImage && !result && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center"
                >
                  <Upload className="w-10 h-10 text-muted-foreground/30" />
                </motion.div>
                <div className="text-center">
                  <p className="text-base font-medium text-muted-foreground/60">
                    {lang === "pt" ? "Nenhuma imagem carregada" : "No image loaded"}
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1">
                    {lang === "pt" ? "Arraste, cole (Ctrl+V) ou clique para importar" : "Drag, paste (Ctrl+V) or click to import"}
                  </p>
                </div>
              </div>
            )}

            {/* ── Side by side ── */}
            {viewMode === "sidebyside" && (sourceImage || result) && (
              <div className="absolute inset-0 grid grid-cols-2">
                <div className="relative flex items-center justify-center border-r border-border/50">
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-background/70 text-muted-foreground backdrop-blur-sm border border-border">
                    {lang === "pt" ? "Original" : "Original"}
                  </span>
                  {sourceImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sourceImage}
                      alt="original"
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: "auto" }}
                    />
                  )}
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent backdrop-blur-sm border border-accent/20">
                    Pixel Art · {result?.pixelSize ?? settings.pixelSize}px
                  </span>
                  {result ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.previewDataUrl}
                      alt="result"
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                      <Sparkles className="w-12 h-12" />
                      <p className="text-xs">{lang === "pt" ? "Aguardando conversão..." : "Awaiting conversion..."}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Slider comparison ── */}
            {viewMode === "slider" && sourceImage && result && (
              <div ref={sliderDivRef} className="absolute inset-0 overflow-hidden select-none cursor-col-resize">
                {/* Full result underneath */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.previewDataUrl}
                  alt="result"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
                {/* Original clipped on left */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sourceImage}
                    alt="original"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ imageRendering: "auto" }}
                  />
                </div>
                {/* Divider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={onSliderMouseDown}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center cursor-col-resize">
                    <ArrowLeftRight className="w-4 h-4 text-foreground/70" />
                  </div>
                </div>
                {/* Labels */}
                <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-background/70 text-muted-foreground border border-border backdrop-blur-sm">
                  {lang === "pt" ? "Original" : "Original"}
                </span>
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm">
                  Pixel Art
                </span>
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/50">
                  {lang === "pt" ? "← Arraste para comparar →" : "← Drag to compare →"}
                </p>
              </div>
            )}

            {/* ── Original only ── */}
            {viewMode === "original" && sourceImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-background/70 text-muted-foreground border border-border backdrop-blur-sm">
                  {lang === "pt" ? "Original" : "Original"}
                  {sourceDims && ` · ${sourceDims.w}×${sourceDims.h}px`}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceImage}
                  alt="original"
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            )}

            {/* ── Result only ── */}
            {viewMode === "result" && result && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-sm">
                  {result.pixelSize}px · {result.palette}{result.dither ? " + dither" : ""}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.previewDataUrl}
                  alt="pixel art result"
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            )}
          </div>

          {/* ── Stats bar ── */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl text-[10px] text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-accent" />
                <span className="text-accent font-medium">{lang === "pt" ? "Convertido" : "Converted"}</span>
              </span>
              <span>·</span>
              <span>{result.pixelSize}×{result.pixelSize}px {lang === "pt" ? "verdadeiro" : "true"}</span>
              <span>·</span>
              <span>{result.previewSize}×{result.previewSize}px {lang === "pt" ? "prévia" : "preview"}</span>
              <span>·</span>
              <span>{selectedPalette.name}</span>
              {result.dither && <><span>·</span><span className="text-amber-400">Floyd-Steinberg</span></>}
              {settings.outline && <><span>·</span><span className="text-purple-400">{lang === "pt" ? "Contorno" : "Outline"}</span></>}
              <span>·</span>
              <span>{result.processingMs}ms</span>
              <button
                onClick={handleConvert}
                className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                {lang === "pt" ? "Reprocessar" : "Reprocess"}
              </button>
            </motion.div>
          )}

          {/* ── Tip when no image and slider mode ── */}
          {viewMode === "slider" && (!sourceImage || !result) && (
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 shrink-0" />
              {lang === "pt"
                ? "Carregue uma imagem e converta para usar o modo de comparação deslizante."
                : "Load an image and convert it to use the slider comparison mode."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
