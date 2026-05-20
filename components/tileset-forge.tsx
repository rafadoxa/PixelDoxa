"use client"

/**
 * TilesetForge
 *
 * Complete tileset workflow for PixelDoxa:
 *  Tab 1 — Generate   : AI-generate a tileset source image (Pollinations free / fal.ai pro)
 *  Tab 2 — Configure  : Set tile size, cols/rows, padding, extrude, preview grid overlay
 *  Tab 3 — Preview    : Interactive tile grid — hover highlights, click selects, info panel
 *  Tab 4 — Export     : Download sheet PNG, JSON metadata (Godot / Unity / GameMaker / Generic)
 *
 * Server route: POST /api/tileset
 * AI generation: POST /api/generate  (reuses existing hybrid model)
 */

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Grid3X3, Wand2, Upload, Download, Settings2,
  Loader2, Check, AlertCircle, RefreshCw, Zap,
  Eye, FileJson, Layers, ChevronRight, ChevronDown,
  Maximize2, Crown, Copy, ExternalLink, Sparkles,
  LayoutGrid, Info, Square, SlidersHorizontal,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

// ── Types ──────────────────────────────────────────────────────────────────

type Tier     = "free" | "pro"
type Tab      = "generate" | "configure" | "preview" | "export"
type Engine   = "godot" | "unity" | "gamemaker" | "generic"
type OutFmt   = "sheet" | "individual" | "both"

interface TilesetResult {
  sheetDataUrl:  string
  tileDataUrls?: string[]
  tileCount:     number
  cols:          number
  rows:          number
  tileSize:      number
  outputTileSize: number
  sheetWidth:    number
  sheetHeight:   number
  metadata:      Record<string, unknown>
  processingMs:  number
}

// ── Constants ──────────────────────────────────────────────────────────────

const TILE_SIZES = [8, 16, 24, 32, 48, 64]

const TILE_THEMES = {
  en: [
    { label: "Dungeon",       prompt: "dungeon stone floor and wall tiles, dark grey, torchlight shadows, 4x4 tileset grid" },
    { label: "Forest",        prompt: "pixel art forest floor tiles, grass, dirt path, flowers, moss, 4x4 tileset" },
    { label: "Cave",          prompt: "pixel art cave rock tiles, stalactites, crystals, dark blues and greys, 4x4 grid" },
    { label: "Castle",        prompt: "medieval castle stone brick tiles, floor and walls, ornate, 4x4 tileset grid" },
    { label: "Desert",        prompt: "pixel art desert sand tiles, dunes, cacti, sandstone ruins, warm palette, 4x4 grid" },
    { label: "Snow",          prompt: "pixel art snow ice tiles, frozen ground, snowflakes, blue-white palette, 4x4 tileset" },
    { label: "Lava",          prompt: "pixel art lava floor tiles, molten rock, embers, dark red and orange, 4x4 tileset" },
    { label: "Village",       prompt: "pixel art village cobblestone floor tiles, wooden planks, garden, 4x4 grid" },
    { label: "Sci-Fi",        prompt: "pixel art sci-fi metal floor tiles, neon lines, grates, futuristic, 4x4 tileset" },
    { label: "Ocean",         prompt: "pixel art ocean water tiles, waves, foam, sand shore, coral, 4x4 tileset" },
    { label: "Interior",      prompt: "pixel art interior floor tiles, wooden planks, carpet, stone, 4x4 tileset" },
    { label: "Graveyard",     prompt: "pixel art graveyard ground tiles, dead grass, tombstone paths, dark, 4x4 grid" },
  ],
  pt: [
    { label: "Dungeon",       prompt: "pixel art dungeon stone floor and wall tiles, dark grey, torchlight shadows, 4x4 tileset grid" },
    { label: "Floresta",      prompt: "pixel art forest floor tiles, grass, dirt path, flowers, moss, 4x4 tileset" },
    { label: "Caverna",       prompt: "pixel art cave rock tiles, stalactites, crystals, dark blues and greys, 4x4 grid" },
    { label: "Castelo",       prompt: "medieval castle stone brick tiles, floor and walls, ornate, 4x4 tileset grid" },
    { label: "Deserto",       prompt: "pixel art desert sand tiles, dunes, cacti, sandstone ruins, warm palette, 4x4 grid" },
    { label: "Neve",          prompt: "pixel art snow ice tiles, frozen ground, snowflakes, blue-white palette, 4x4 tileset" },
    { label: "Lava",          prompt: "pixel art lava floor tiles, molten rock, embers, dark red and orange, 4x4 tileset" },
    { label: "Vila",          prompt: "pixel art village cobblestone floor tiles, wooden planks, garden, 4x4 grid" },
    { label: "Sci-Fi",        prompt: "pixel art sci-fi metal floor tiles, neon lines, grates, futuristic, 4x4 tileset" },
    { label: "Oceano",        prompt: "pixel art ocean water tiles, waves, foam, sand shore, coral, 4x4 tileset" },
    { label: "Interior",      prompt: "pixel art interior floor tiles, wooden planks, carpet, stone, 4x4 tileset" },
    { label: "Cemitério",     prompt: "pixel art graveyard ground tiles, dead grass, tombstone paths, dark, 4x4 grid" },
  ],
}

const PALETTES = [
  { id: "default",   name: "Default",  colors: ["#1a1c2c","#5d275d","#b13e53","#ef7d57","#ffcd75","#a7f070"] },
  { id: "nes",       name: "NES",      colors: ["#7c7c7c","#0000fc","#0078f8","#fcbcb0","#f8d878","#00b800"] },
  { id: "pico8",     name: "PICO-8",   colors: ["#000000","#1d2b53","#7e2553","#008751","#ab5236","#c2c3c7"] },
  { id: "endesga32", name: "Endesga",  colors: ["#be4a2f","#d77643","#ead4aa","#e4a672","#b86f50","#3e2731"] },
  { id: "monokai",   name: "Monokai",  colors: ["#272822","#75715e","#f8f8f2","#66d9e8","#a6e22e","#f92672"] },
]

const ENGINE_INFO: Record<Engine, { label: string; color: string; hint: string }> = {
  godot:      { label: "Godot 4",     color: "text-blue-400",    hint: ".tres snippet + TileSetAtlasSource JSON" },
  unity:      { label: "Unity",       color: "text-gray-300",    hint: ".meta Sprite Atlas JSON (Point filter)" },
  gamemaker:  { label: "GameMaker",   color: "text-yellow-400",  hint: ".yy TileSet resource JSON" },
  generic:    { label: "Generic",     color: "text-accent",      hint: "Universal JSON with tile coords" },
}

// ── Component ──────────────────────────────────────────────────────────────

export function TilesetForge() {
  const { lang } = useLanguage()
  const themes = TILE_THEMES[lang] ?? TILE_THEMES.en

  // ── Source image state ─────────────────────────────────────────────────
  const [sourceImage, setSourceImage]       = useState<string | null>(null)
  const [sourceLabel, setSourceLabel]       = useState<string>("")

  // ── AI generation state ────────────────────────────────────────────────
  const [tier, setTier]                     = useState<Tier>("free")
  const [prompt, setPrompt]                 = useState("")
  const [palette, setPalette]               = useState("default")
  const [genSize, setGenSize]               = useState("256x256")  // large source for slicing
  const [isGenerating, setIsGenerating]     = useState(false)
  const [genError, setGenError]             = useState<string | null>(null)
  const [genTime, setGenTime]               = useState<number | null>(null)

  // ── Config state ───────────────────────────────────────────────────────
  const [tileSize, setTileSize]             = useState(16)
  const [cols, setCols]                     = useState(4)
  const [rows, setRows]                     = useState(4)
  const [padding, setPadding]               = useState(0)
  const [extrude, setExtrude]               = useState(false)
  const [showGrid, setShowGrid]             = useState(true)
  const [zoom, setZoom]                     = useState(2)

  // ── Processing state ───────────────────────────────────────────────────
  const [isProcessing, setIsProcessing]     = useState(false)
  const [processError, setProcessError]     = useState<string | null>(null)
  const [result, setResult]                 = useState<TilesetResult | null>(null)

  // ── Export state ───────────────────────────────────────────────────────
  const [engine, setEngine]                 = useState<Engine>("godot")
  const [outputFormat, setOutputFormat]     = useState<OutFmt>("sheet")
  const [sheetName, setSheetName]           = useState("tileset")
  const [metadataCopied, setMetadataCopied] = useState(false)

  // ── UI state ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]           = useState<Tab>("generate")
  const [hoveredTile, setHoveredTile]       = useState<number | null>(null)
  const [selectedTile, setSelectedTile]     = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Auto-detect cols/rows from source image when tileSize changes ──────
  useEffect(() => {
    if (!sourceImage) return
    const img = new window.Image()
    img.onload = () => {
      const newCols = Math.max(1, Math.floor(img.width  / tileSize))
      const newRows = Math.max(1, Math.floor(img.height / tileSize))
      setCols(Math.min(newCols, 16))
      setRows(Math.min(newRows, 16))
    }
    img.src = sourceImage
  }, [sourceImage, tileSize])

  // ── AI Generate source image ───────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGenError(null)
    setSourceImage(null)
    setResult(null)
    const t0 = Date.now()

    const tilesetPrompt = [
      prompt,
      "tileset grid layout, multiple tile variations, seamless texture,",
      "top-down view, game asset, pixel art, no anti-aliasing,",
      "clean pixel edges, 4x4 or 8x8 grid of tiles",
    ].join(" ")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:  tilesetPrompt,
          size:    genSize,
          palette,
          style:   "tile",
          removeBackground: false,
          tier,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed")
      setSourceImage(data.imageUrl)
      setSourceLabel(lang === "pt" ? "Gerado por IA" : "AI Generated")
      setGenTime(Math.round((Date.now() - t0) / 1000))
      setActiveTab("configure")
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, genSize, palette, tier, lang])

  // ── Upload source image ────────────────────────────────────────────────
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setSourceImage(url)
      setSourceLabel(file.name)
      setResult(null)
      setActiveTab("configure")
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setSourceImage(ev.target?.result as string)
      setSourceLabel(file.name)
      setResult(null)
      setActiveTab("configure")
    }
    reader.readAsDataURL(file)
  }, [])

  // ── Process tileset ────────────────────────────────────────────────────
  const handleProcess = useCallback(async () => {
    if (!sourceImage) return
    setIsProcessing(true)
    setProcessError(null)

    try {
      const res = await fetch("/api/tileset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl:     sourceImage,
          tileSize,
          cols,
          rows,
          padding,
          extrude,
          outputFormat,
          engine,
          sheetName,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Processing failed")
      setResult(data as TilesetResult)
      setActiveTab("preview")
    } catch (err: unknown) {
      setProcessError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setIsProcessing(false)
    }
  }, [sourceImage, tileSize, cols, rows, padding, extrude, outputFormat, engine, sheetName])

  // ── Download ───────────────────────────────────────────────────────────
  const downloadSheet = () => {
    if (!result?.sheetDataUrl) return
    const a = document.createElement("a")
    a.href = result.sheetDataUrl
    a.download = `${sheetName}.png`
    a.click()
  }

  const downloadMetadata = () => {
    if (!result?.metadata) return
    const json  = JSON.stringify(result.metadata, null, 2)
    const blob  = new Blob([json], { type: "application/json" })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement("a")
    a.href      = url
    a.download  = `${sheetName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyMetadata = () => {
    if (!result?.metadata) return
    navigator.clipboard.writeText(JSON.stringify(result.metadata, null, 2))
    setMetadataCopied(true)
    setTimeout(() => setMetadataCopied(false), 2000)
  }

  const downloadTile = (dataUrl: string, idx: number) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `${sheetName}_tile_${String(idx).padStart(3, "0")}.png`
    a.click()
  }

  // ── Tab definitions ────────────────────────────────────────────────────
  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "generate",  icon: Wand2,         label: lang === "pt" ? "Gerar"      : "Generate"  },
    { id: "configure", icon: SlidersHorizontal, label: lang === "pt" ? "Configurar" : "Configure" },
    { id: "preview",   icon: Eye,           label: lang === "pt" ? "Prévia"     : "Preview"   },
    { id: "export",    icon: Download,      label: lang === "pt" ? "Exportar"   : "Export"    },
  ]

  const tierInfo = {
    free: { label: lang === "pt" ? "Grátis" : "Free", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: Zap },
    pro:  { label: "Pro",                              color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/30",  icon: Crown },
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🧱</span>
            Tileset Forge
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "pt"
              ? "Gere, fatie e exporte tilesets alinhados na grade — prontos para Unity, Godot e GameMaker"
              : "Generate, slice and export grid-aligned tilesets — ready for Unity, Godot and GameMaker"}
          </p>
        </div>
        {result && (
          <div className="text-right text-xs text-muted-foreground">
            <p className="text-accent font-medium">{result.tileCount} {lang === "pt" ? "tiles" : "tiles"}</p>
            <p>{result.cols}×{result.rows} · {result.outputTileSize}px</p>
          </div>
        )}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 p-1 bg-secondary/40 rounded-xl border border-border w-fit">
        {tabs.map((tab, i) => {
          const Icon     = tab.icon
          const isActive = activeTab === tab.id
          const isDone   = (tab.id === "configure" && !!sourceImage) ||
                           (tab.id === "preview"   && !!result)      ||
                           (tab.id === "export"    && !!result)
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isDone && !isActive
                ? <Check className="w-3.5 h-3.5 text-accent" />
                : <Icon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{tab.label}</span>
              {i < tabs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 hidden sm:block ml-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* ════════════════════════════════════════════════════
          TAB 1 — GENERATE
      ════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeTab === "generate" && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Left — AI controls */}
            <div className="space-y-5 bg-card border border-border rounded-xl p-5">

              {/* Tier selector */}
              <div>
                <Label className="text-xs mb-2 block">
                  {lang === "pt" ? "Provedor de IA" : "AI Provider"}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["free", "pro"] as Tier[]).map((t) => {
                    const info   = tierInfo[t]
                    const Icon   = info.icon
                    const active = tier === t
                    return (
                      <button
                        key={t}
                        onClick={() => setTier(t)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left",
                          active ? `${info.bg} ${info.border}` : "border-border bg-secondary/20 hover:border-muted-foreground/40"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5", active ? info.color : "text-muted-foreground")} />
                        <div>
                          <p className={cn("text-xs font-bold", active ? info.color : "text-muted-foreground")}>{info.label}</p>
                          <p className="text-[9px] text-muted-foreground">
                            {t === "free" ? "Pollinations · ~20s" : "fal.ai · ~4s"}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Theme quickpicks */}
              <div>
                <Label className="text-xs mb-2 block">
                  {lang === "pt" ? "Tema rápido" : "Quick theme"}
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {themes.map((theme) => (
                    <button
                      key={theme.label}
                      onClick={() => setPrompt(theme.prompt)}
                      className={cn(
                        "text-[10px] px-2 py-1 rounded-full border transition-all",
                        prompt === theme.prompt
                          ? "bg-accent/10 border-accent/40 text-accent"
                          : "bg-secondary hover:bg-accent/10 border-border text-muted-foreground hover:border-accent/30 hover:text-accent"
                      )}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-1.5">
                <Label htmlFor="tileset-prompt" className="text-xs">
                  {lang === "pt" ? "Descrição do tileset" : "Tileset description"}
                </Label>
                <Textarea
                  id="tileset-prompt"
                  placeholder={
                    lang === "pt"
                      ? "Ex: Chão de dungeon de pedra escura, paredes com tocha, tons cinza..."
                      : "E.g. Dark stone dungeon floor, torch walls, grey tones, moss..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] bg-secondary/50 border-border resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
                  }}
                />
              </div>

              {/* Controls row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Resolução" : "Resolution"}</Label>
                  <Select value={genSize} onValueChange={setGenSize}>
                    <SelectTrigger className="h-8 text-xs bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["128x128","256x256","512x512"].map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Paleta" : "Palette"}</Label>
                  <Select value={palette} onValueChange={setPalette}>
                    <SelectTrigger className="h-8 text-xs bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PALETTES.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Palette preview */}
              <div className="flex gap-1">
                {(PALETTES.find(p => p.id === palette) ?? PALETTES[0]).colors.map((c, i) => (
                  <div key={i} className="h-5 flex-1 rounded" style={{ backgroundColor: c }} />
                ))}
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={cn(
                  "w-full font-semibold",
                  tier === "free"
                    ? "bg-emerald-600 hover:bg-emerald-600/90 text-white"
                    : "bg-violet-600 hover:bg-violet-600/90 text-white"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {lang === "pt" ? "Gerando tileset..." : "Generating tileset..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {lang === "pt" ? "Gerar Tileset com IA" : "Generate Tileset with AI"}
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground -mt-2">
                Ctrl/⌘ + Enter
                {tier === "free" && <span className="ml-2 text-emerald-500">· {lang === "pt" ? "100% gratuito" : "100% free"}</span>}
              </p>

              {/* Gen error */}
              {genError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">{lang === "pt" ? "Erro na geração" : "Generation error"}</p>
                    <p className="text-muted-foreground mt-0.5">{genError}</p>
                  </div>
                </div>
              )}

              {/* Gen time badge */}
              {genTime && !isGenerating && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Check className="w-3 h-3 text-accent" />
                  {lang === "pt" ? `Gerado em ${genTime}s` : `Generated in ${genTime}s`}
                  <span className="text-muted-foreground/40 ml-1">·</span>
                  <button
                    onClick={() => setActiveTab("configure")}
                    className="text-accent hover:underline flex items-center gap-0.5"
                  >
                    {lang === "pt" ? "Configurar grade" : "Configure grid"}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Right — Upload OR source preview */}
            <div className="space-y-4">
              {/* Upload zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl transition-all cursor-pointer",
                  sourceImage
                    ? "border-accent/30 bg-accent/5 p-3"
                    : "border-border hover:border-accent/40 hover:bg-accent/5 p-8 flex flex-col items-center gap-3"
                )}
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

                {sourceImage ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">{sourceLabel}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {lang === "pt" ? "Fonte" : "Source"}
                      </span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sourceImage}
                      alt="Tileset source"
                      className="w-full rounded-lg object-contain max-h-64"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="text-[10px] text-center text-muted-foreground">
                      {lang === "pt" ? "Clique para trocar imagem" : "Click to replace image"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {lang === "pt" ? "Arraste ou clique para importar" : "Drag or click to import"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === "pt" ? "PNG, JPG, WebP — qualquer resolução" : "PNG, JPG, WebP — any resolution"}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground">
                      {["Aseprite export", "Tiled source", "Photoshop", lang === "pt" ? "Qualquer imagem" : "Any image"].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full border border-border bg-secondary/50">{s}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Workflow hint */}
              <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
                <p className="text-xs font-medium flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-accent" />
                  {lang === "pt" ? "Como funciona" : "How it works"}
                </p>
                <div className="space-y-2">
                  {[
                    { icon: Wand2,     label: lang === "pt" ? "Gere ou importe uma imagem fonte" : "Generate or import a source image" },
                    { icon: Grid3X3,   label: lang === "pt" ? "Configure o tamanho do tile e a grade" : "Set tile size and grid layout" },
                    { icon: Eye,       label: lang === "pt" ? "Prévia interativa de cada tile" : "Interactive preview of each tile" },
                    { icon: Download,  label: lang === "pt" ? "Exporte PNG + JSON para Unity/Godot" : "Export PNG + JSON for Unity/Godot" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-accent font-bold">{i + 1}</span>
                      </div>
                      <step.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 2 — CONFIGURE
        ════════════════════════════════════════════════════ */}
        {activeTab === "configure" && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid lg:grid-cols-5 gap-6"
          >
            {/* Left — Controls (2 cols) */}
            <div className="lg:col-span-2 space-y-5 bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                {lang === "pt" ? "Configuração da Grade" : "Grid Configuration"}
              </p>

              {/* Tile size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{lang === "pt" ? "Tamanho do Tile" : "Tile Size"}</Label>
                  <span className="text-xs font-mono text-accent">{tileSize}px</span>
                </div>
                <div className="flex gap-2">
                  {TILE_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTileSize(s)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-all",
                        tileSize === s
                          ? "bg-accent/10 border-accent/40 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/30"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cols */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{lang === "pt" ? "Colunas" : "Columns"}</Label>
                  <span className="text-xs font-mono text-accent">{cols}</span>
                </div>
                <Slider
                  min={1} max={16} step={1}
                  value={[cols]}
                  onValueChange={([v]) => setCols(v)}
                  className="accent-accent"
                />
              </div>

              {/* Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{lang === "pt" ? "Linhas" : "Rows"}</Label>
                  <span className="text-xs font-mono text-accent">{rows}</span>
                </div>
                <Slider
                  min={1} max={16} step={1}
                  value={[rows]}
                  onValueChange={([v]) => setRows(v)}
                  className="accent-accent"
                />
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{lang === "pt" ? "Espaçamento (px)" : "Padding (px)"}</Label>
                  <span className="text-xs font-mono text-accent">{padding}px</span>
                </div>
                <Slider
                  min={0} max={8} step={1}
                  value={[padding]}
                  onValueChange={([v]) => setPadding(v)}
                />
                <p className="text-[10px] text-muted-foreground">
                  {lang === "pt" ? "Espaço entre tiles no sheet de saída" : "Gap between tiles in output sheet"}
                </p>
              </div>

              {/* Extrude toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
                <div>
                  <p className="text-xs font-medium">{lang === "pt" ? "Extrudar bordas" : "Extrude borders"}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "pt"
                      ? "Duplica 1px de borda — previne bleeding no atlas da GPU"
                      : "Duplicates 1px edge — prevents GPU atlas bleeding"}
                  </p>
                </div>
                <button
                  onClick={() => setExtrude(!extrude)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors duration-200",
                    extrude ? "bg-accent" : "bg-secondary border border-border"
                  )}
                >
                  <motion.div
                    animate={{ x: extrude ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
              </div>

              {/* Grid overlay toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
                <div>
                  <p className="text-xs font-medium">{lang === "pt" ? "Mostrar grade" : "Show grid overlay"}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {lang === "pt" ? "Visualiza o alinhamento dos tiles" : "Visualise tile alignment"}
                  </p>
                </div>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors duration-200",
                    showGrid ? "bg-accent" : "bg-secondary border border-border"
                  )}
                >
                  <motion.div
                    animate={{ x: showGrid ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
              </div>

              {/* Zoom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{lang === "pt" ? "Zoom da prévia" : "Preview zoom"}</Label>
                  <span className="text-xs font-mono text-accent">{zoom}×</span>
                </div>
                <Slider
                  min={1} max={8} step={1}
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                />
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-1 text-[10px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>{lang === "pt" ? "Total de tiles:" : "Total tiles:"}</span>
                  <span className="text-accent font-medium">{cols * rows}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === "pt" ? "Tile de saída:" : "Output tile:"}</span>
                  <span className="text-accent font-medium">{extrude ? tileSize + 2 : tileSize}px</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === "pt" ? "Sheet de saída:" : "Output sheet:"}</span>
                  <span className="text-accent font-medium">
                    {cols * ((extrude ? tileSize + 2 : tileSize) + padding) - padding}×{rows * ((extrude ? tileSize + 2 : tileSize) + padding) - padding}px
                  </span>
                </div>
              </div>

              {/* Engine selector (for metadata) */}
              <div className="space-y-1.5">
                <Label className="text-xs">{lang === "pt" ? "Engine alvo" : "Target engine"}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ENGINE_INFO) as Engine[]).map((eng) => {
                    const info = ENGINE_INFO[eng]
                    return (
                      <button
                        key={eng}
                        onClick={() => setEngine(eng)}
                        className={cn(
                          "p-2 rounded-lg border text-left transition-all",
                          engine === eng
                            ? "border-accent/40 bg-accent/10"
                            : "border-border bg-secondary/30 hover:border-muted-foreground/40"
                        )}
                      >
                        <p className={cn("text-xs font-semibold", engine === eng ? info.color : "text-muted-foreground")}>
                          {info.label}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{info.hint}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Process button */}
              {sourceImage && (
                <>
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {lang === "pt" ? "Processando..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Grid3X3 className="w-4 h-4 mr-2" />
                        {lang === "pt" ? "Gerar Tileset" : "Build Tileset"}
                      </>
                    )}
                  </Button>
                  {processError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {processError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Right — Source preview with grid overlay (3 cols) */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 flex flex-col gap-4">
              <p className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent" />
                {lang === "pt" ? "Prévia da Fonte" : "Source Preview"}
              </p>

              {sourceImage ? (
                <div className="flex-1 flex items-center justify-center overflow-auto">
                  <div className="relative inline-block" style={{ imageRendering: "pixelated" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sourceImage}
                      alt="Source"
                      style={{
                        imageRendering: "pixelated",
                        width: `${cols * tileSize * zoom}px`,
                        height: `${rows * tileSize * zoom}px`,
                        display: "block",
                      }}
                    />
                    {/* Grid overlay */}
                    {showGrid && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right,  rgba(0,255,200,0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,255,200,0.4) 1px, transparent 1px)
                          `,
                          backgroundSize: `${tileSize * zoom}px ${tileSize * zoom}px`,
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
                  <Grid3X3 className="w-16 h-16" />
                  <p className="text-sm">
                    {lang === "pt" ? "Nenhuma imagem fonte" : "No source image"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("generate")}
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                    {lang === "pt" ? "Gerar imagem" : "Generate image"}
                  </Button>
                </div>
              )}

              {/* Grid info */}
              {sourceImage && (
                <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground border-t border-border pt-3">
                  <span>📐 {cols}×{rows} {lang === "pt" ? "tiles" : "tiles"}</span>
                  <span>🔲 {tileSize}px / {lang === "pt" ? "tile" : "tile"}</span>
                  {extrude && <span className="text-amber-400">⚡ {lang === "pt" ? "Extrude +2px" : "Extrude +2px"}</span>}
                  {showGrid && <span className="text-accent">✦ {lang === "pt" ? "Grade ativa" : "Grid active"}</span>}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 3 — PREVIEW
        ════════════════════════════════════════════════════ */}
        {activeTab === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Tile grid (2 cols) */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-accent" />
                  {lang === "pt" ? "Grade de Tiles" : "Tile Grid"}
                </p>
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] text-muted-foreground">{lang === "pt" ? "Zoom" : "Zoom"}</Label>
                  <Slider
                    min={1} max={8} step={1}
                    value={[zoom]}
                    onValueChange={([v]) => setZoom(v)}
                    className="w-24"
                  />
                  <span className="text-[10px] text-accent font-mono w-6">{zoom}×</span>
                </div>
              </div>

              {result ? (
                <div className="overflow-auto max-h-[520px]">
                  {/* Full sheet preview */}
                  <div className="mb-4">
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {lang === "pt" ? "Sheet completo" : "Full sheet"} — {result.sheetWidth}×{result.sheetHeight}px
                    </p>
                    <div
                      className="relative inline-block rounded border border-border overflow-hidden cursor-crosshair"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='6' height='6' fill='%23333'/%3E%3Crect x='6' y='6' width='6' height='6' fill='%23333'/%3E%3Crect x='6' width='6' height='6' fill='%23222'/%3E%3Crect y='6' width='6' height='6' fill='%23222'/%3E%3C/svg%3E")`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.sheetDataUrl}
                        alt="Tileset sheet"
                        style={{
                          imageRendering: "pixelated",
                          width: `${result.sheetWidth * zoom}px`,
                          display: "block",
                        }}
                      />
                      {/* Grid lines overlay */}
                      {showGrid && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right,  rgba(0,255,200,0.3) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0,255,200,0.3) 1px, transparent 1px)
                            `,
                            backgroundSize: `${(result.outputTileSize + padding) * zoom}px ${(result.outputTileSize + padding) * zoom}px`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Individual tiles */}
                  {result.tileDataUrls && result.tileDataUrls.length > 0 && (
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        {lang === "pt" ? "Tiles individuais" : "Individual tiles"} ({result.tileCount})
                      </p>
                      <div
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${result.cols}, minmax(0, 1fr))` }}
                      >
                        {result.tileDataUrls.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedTile(selectedTile === i ? null : i)}
                            onMouseEnter={() => setHoveredTile(i)}
                            onMouseLeave={() => setHoveredTile(null)}
                            className={cn(
                              "relative rounded border transition-all overflow-hidden",
                              selectedTile === i
                                ? "border-accent ring-1 ring-accent/40"
                                : hoveredTile === i
                                  ? "border-accent/50"
                                  : "border-border"
                            )}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23333'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23333'/%3E%3Crect x='4' width='4' height='4' fill='%23222'/%3E%3Crect y='4' width='4' height='4' fill='%23222'/%3E%3C/svg%3E")`,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`tile ${i}`}
                              style={{
                                imageRendering: "pixelated",
                                width: `${result.outputTileSize * Math.max(1, Math.floor(64 / result.outputTileSize))}px`,
                                height: `${result.outputTileSize * Math.max(1, Math.floor(64 / result.outputTileSize))}px`,
                                display: "block",
                              }}
                            />
                            {(hoveredTile === i || selectedTile === i) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <span className="text-[8px] font-mono text-white">{i}</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground/40">
                  <Grid3X3 className="w-16 h-16" />
                  <p className="text-sm">
                    {lang === "pt" ? "Processe o tileset primeiro" : "Process the tileset first"}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("configure")}>
                    <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                    {lang === "pt" ? "Configurar" : "Configure"}
                  </Button>
                </div>
              )}
            </div>

            {/* Right — Selected tile info + stats */}
            <div className="space-y-4">
              {/* Stats */}
              {result && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-accent" />
                    {lang === "pt" ? "Informações" : "Info"}
                  </p>
                  {[
                    { k: lang === "pt" ? "Total de tiles" : "Total tiles",   v: result.tileCount },
                    { k: lang === "pt" ? "Grade" : "Grid",                   v: `${result.cols}×${result.rows}` },
                    { k: lang === "pt" ? "Tile original" : "Source tile",    v: `${result.tileSize}px` },
                    { k: lang === "pt" ? "Tile de saída" : "Output tile",    v: `${result.outputTileSize}px${extrude ? " (+extrude)" : ""}` },
                    { k: lang === "pt" ? "Sheet" : "Sheet size",             v: `${result.sheetWidth}×${result.sheetHeight}px` },
                    { k: lang === "pt" ? "Processado em" : "Processed in",   v: `${result.processingMs}ms` },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-mono text-accent">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected tile detail */}
              {selectedTile !== null && result?.tileDataUrls?.[selectedTile] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-accent/30 rounded-xl p-4 space-y-3"
                >
                  <p className="text-xs font-semibold text-accent">
                    Tile #{selectedTile} — {lang === "pt" ? "Selecionado" : "Selected"}
                  </p>
                  <div
                    className="flex items-center justify-center p-4 rounded-lg"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='6' height='6' fill='%23333'/%3E%3Crect x='6' y='6' width='6' height='6' fill='%23333'/%3E%3Crect x='6' width='6' height='6' fill='%23222'/%3E%3Crect y='6' width='6' height='6' fill='%23222'/%3E%3C/svg%3E")`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.tileDataUrls[selectedTile]}
                      alt={`tile ${selectedTile} large`}
                      style={{ imageRendering: "pixelated", width: `${result.outputTileSize * 6}px`, height: `${result.outputTileSize * 6}px` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>{lang === "pt" ? "Coluna" : "Column"}</span>
                      <span className="text-accent font-mono">{selectedTile % result.cols}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "pt" ? "Linha" : "Row"}</span>
                      <span className="text-accent font-mono">{Math.floor(selectedTile / result.cols)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID</span>
                      <span className="text-accent font-mono">{selectedTile}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadTile(result.tileDataUrls![selectedTile], selectedTile)}
                    className="w-full h-7 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1.5" />
                    {lang === "pt" ? "Baixar tile" : "Download tile"}
                  </Button>
                </motion.div>
              )}

              {/* Grid toggle */}
              {result && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <span className="text-xs">{lang === "pt" ? "Overlay de grade" : "Grid overlay"}</span>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={cn(
                      "relative w-9 h-5 rounded-full transition-colors",
                      showGrid ? "bg-accent" : "bg-secondary border border-border"
                    )}
                  >
                    <motion.div
                      animate={{ x: showGrid ? 17 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                    />
                  </button>
                </div>
              )}

              {/* Go to export */}
              {result && (
                <Button
                  onClick={() => setActiveTab("export")}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {lang === "pt" ? "Exportar" : "Export"}
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 4 — EXPORT
        ════════════════════════════════════════════════════ */}
        {activeTab === "export" && (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Left — download options */}
            <div className="space-y-4">

              {/* Sheet name */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-accent" />
                  {lang === "pt" ? "Opções de Exportação" : "Export Options"}
                </p>

                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Nome do arquivo" : "File name"}</Label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "_"))}
                    className="w-full h-8 px-3 rounded-lg bg-secondary/50 border border-border text-sm font-mono text-accent focus:outline-none focus:border-accent/50"
                    placeholder="tileset"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {lang === "pt" ? "Usado em" : "Used in"}: <span className="text-accent">{sheetName}.png</span> + <span className="text-accent">{sheetName}.json</span>
                  </p>
                </div>

                {/* Output format */}
                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Formato de saída" : "Output format"}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["sheet", "individual", "both"] as OutFmt[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={cn(
                          "py-2 px-2 rounded-lg border text-center text-[10px] font-medium transition-all",
                          outputFormat === fmt
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border text-muted-foreground hover:border-accent/30"
                        )}
                      >
                        {fmt === "sheet"      && (lang === "pt" ? "Sheet" : "Sheet")}
                        {fmt === "individual" && (lang === "pt" ? "Individual" : "Individual")}
                        {fmt === "both"       && (lang === "pt" ? "Ambos" : "Both")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine for metadata re-generation */}
                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Engine alvo" : "Target engine"}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(ENGINE_INFO) as Engine[]).map((eng) => {
                      const info = ENGINE_INFO[eng]
                      return (
                        <button
                          key={eng}
                          onClick={() => setEngine(eng)}
                          className={cn(
                            "p-2.5 rounded-lg border text-left transition-all",
                            engine === eng
                              ? "border-accent/40 bg-accent/10"
                              : "border-border bg-secondary/30 hover:border-muted-foreground/40"
                          )}
                        >
                          <p className={cn("text-xs font-semibold", engine === eng ? info.color : "text-muted-foreground")}>
                            {info.label}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Download actions */}
              {result ? (
                <div className="space-y-3">
                  {/* PNG Sheet */}
                  <button
                    onClick={downloadSheet}
                    className="w-full flex items-center gap-4 p-4 bg-card border border-border hover:border-accent/40 hover:bg-accent/5 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <ImageIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{sheetName}.png</p>
                      <p className="text-xs text-muted-foreground">
                        {result.sheetWidth}×{result.sheetHeight}px · {result.tileCount} {lang === "pt" ? "tiles" : "tiles"} · PNG {lang === "pt" ? "transparente" : "transparent"}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-accent shrink-0" />
                  </button>

                  {/* JSON Metadata */}
                  <button
                    onClick={downloadMetadata}
                    className="w-full flex items-center gap-4 p-4 bg-card border border-border hover:border-accent/40 hover:bg-accent/5 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <FileJson className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{sheetName}.json</p>
                      <p className="text-xs text-muted-foreground">
                        {ENGINE_INFO[engine].label} · {ENGINE_INFO[engine].hint}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-blue-400 shrink-0" />
                  </button>

                  {/* Regenerate with new options */}
                  <Button
                    variant="outline"
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full border-border"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{lang === "pt" ? "Reprocessando..." : "Reprocessing..."}</>
                    ) : (
                      <><RefreshCw className="w-4 h-4 mr-2" />{lang === "pt" ? "Reprocessar com configurações atuais" : "Reprocess with current settings"}</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12 bg-card border border-border rounded-xl text-muted-foreground/40">
                  <Download className="w-12 h-12" />
                  <p className="text-sm">{lang === "pt" ? "Processe o tileset primeiro" : "Process the tileset first"}</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("configure")}>
                    {lang === "pt" ? "Ir para configuração" : "Go to configure"}
                  </Button>
                </div>
              )}
            </div>

            {/* Right — engine integration guide + metadata preview */}
            <div className="space-y-4">

              {/* Engine guide */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  {lang === "pt" ? "Guia de Integração" : "Integration Guide"} — {ENGINE_INFO[engine].label}
                </p>

                {engine === "godot" && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {[
                      lang === "pt" ? "Importe o PNG em res://tilesets/" : "Import PNG into res://tilesets/",
                      lang === "pt" ? "Vá em Project → TileSet → New TileSetAtlasSource" : "Go to Project → TileSet → New TileSetAtlasSource",
                      lang === "pt" ? "Arraste o PNG para o campo Texture" : "Drag PNG to the Texture field",
                      lang === "pt" ? `Defina Texture Region Size para ${result?.outputTileSize ?? tileSize}×${result?.outputTileSize ?? tileSize}` : `Set Texture Region Size to ${result?.outputTileSize ?? tileSize}×${result?.outputTileSize ?? tileSize}`,
                      lang === "pt" ? "Clique em Setup AutoTiles com o JSON exportado" : "Click Setup AutoTiles using exported JSON",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-[9px] text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {engine === "unity" && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {[
                      lang === "pt" ? "Arraste o PNG para a pasta Assets/" : "Drag PNG into Assets/ folder",
                      lang === "pt" ? "Selecione o PNG → Inspector → Texture Type: Sprite (2D and UI)" : "Select PNG → Inspector → Texture Type: Sprite (2D and UI)",
                      lang === "pt" ? "Sprite Mode: Multiple · Filter Mode: Point (no filter)" : "Sprite Mode: Multiple · Filter Mode: Point (no filter)",
                      lang === "pt" ? "Clique em Sprite Editor → Slice → Grid by Cell Size" : "Sprite Editor → Slice → Grid by Cell Size",
                      lang === "pt" ? `Cell Size: ${result?.outputTileSize ?? tileSize}×${result?.outputTileSize ?? tileSize} — Apply` : `Cell Size: ${result?.outputTileSize ?? tileSize}×${result?.outputTileSize ?? tileSize} — Apply`,
                      lang === "pt" ? "Use o JSON exportado como .meta para automação" : "Use exported JSON as .meta for automation",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-gray-500/10 border border-gray-500/30 text-[9px] text-gray-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {engine === "gamemaker" && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {[
                      lang === "pt" ? "Importe o PNG como Sprite (Add Existing)" : "Import PNG as Sprite (Add Existing)",
                      lang === "pt" ? `Defina Width/Height do frame para ${result?.outputTileSize ?? tileSize}px` : `Set frame Width/Height to ${result?.outputTileSize ?? tileSize}px`,
                      lang === "pt" ? "Crie um Tile Set → aponte para o sprite importado" : "Create a Tile Set → point to imported sprite",
                      lang === "pt" ? "Defina Tile Width/Height igual ao sprite frame" : "Set Tile Width/Height equal to sprite frame",
                      lang === "pt" ? "Use o JSON exportado para automação via extensão" : "Use exported JSON for automation via extension",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-[9px] text-yellow-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {engine === "generic" && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>{lang === "pt" ? "O JSON genérico contém:" : "The generic JSON contains:"}</p>
                    {[
                      lang === "pt" ? "Coordenadas x/y de cada tile no sheet" : "x/y coordinates of each tile in sheet",
                      lang === "pt" ? "Dimensões do sheet e de cada tile" : "Sheet and tile dimensions",
                      lang === "pt" ? "Grade completa cols×rows com IDs" : "Full cols×rows grid with IDs",
                      lang === "pt" ? "Compatível com qualquer engine/framework" : "Compatible with any engine/framework",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-accent shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Metadata JSON preview */}
              {result && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                    <p className="text-xs font-semibold flex items-center gap-2">
                      <FileJson className="w-3.5 h-3.5 text-blue-400" />
                      {sheetName}.json
                    </p>
                    <button
                      onClick={copyMetadata}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {metadataCopied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                      {metadataCopied ? (lang === "pt" ? "Copiado!" : "Copied!") : (lang === "pt" ? "Copiar" : "Copy")}
                    </button>
                  </div>
                  <pre className="p-4 text-[10px] text-muted-foreground font-mono overflow-auto max-h-56 leading-relaxed">
                    {JSON.stringify(result.metadata, null, 2).slice(0, 800)}
                    {JSON.stringify(result.metadata, null, 2).length > 800 ? "\n  ..." : ""}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
