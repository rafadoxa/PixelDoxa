"use client"

/**
 * SpritesheetSlicer
 *
 * Full workflow:
 *  1. Upload OR generate sprites via AI (reuses AIGenerationPanel logic)
 *  2. Manage frame list (drag-to-reorder, duplicate, delete)
 *  3. Preview animation in real-time (CSS animation on canvas)
 *  4. Configure layout (cols, fps, frame size, padding)
 *  5. Export: PNG sprite sheet  |  Animated GIF  |  both
 */

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  Film, Upload, Wand2, Trash2, Copy, Download,
  Play, Pause, Plus, Loader2, Grid3X3, Zap,
  ChevronLeft, ChevronRight, RefreshCw, Image,
  Settings2, Check, AlertCircle, GripVertical,
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

interface SpriteFrame {
  id: string
  dataUrl: string  // always base64 data URL after processing
  label: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const FRAME_SIZES = ["16x16", "32x32", "48x48", "64x64", "128x128"]

const ANIMATION_PRESETS = [
  { label: "Walk (4f)",    frames: 4, fps: 8  },
  { label: "Run (6f)",     frames: 6, fps: 12 },
  { label: "Idle (2f)",    frames: 2, fps: 3  },
  { label: "Attack (5f)",  frames: 5, fps: 10 },
  { label: "Death (6f)",   frames: 6, fps: 6  },
  { label: "Spin (8f)",    frames: 8, fps: 12 },
]

const PALETTES = [
  { id: "default",   name: "Default",  colors: ["#1a1c2c","#5d275d","#b13e53","#ef7d57","#ffcd75","#a7f070"] },
  { id: "gameboy",   name: "GameBoy",  colors: ["#0f380f","#306230","#8bac0f","#9bbc0f"] },
  { id: "pico8",     name: "PICO-8",   colors: ["#000000","#1d2b53","#7e2553","#008751","#ab5236","#c2c3c7"] },
  { id: "endesga32", name: "Endesga",  colors: ["#be4a2f","#d77643","#ead4aa","#e4a672","#38b764","#3b5dc9"] },
  { id: "monokai",   name: "Monokai",  colors: ["#272822","#f8f8f2","#66d9e8","#a6e22e","#f92672","#ae81ff"] },
]

// ── Checkerboard background ────────────────────────────────────────────────

const CHECKER_BG = `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23333'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23333'/%3E%3Crect x='8' width='8' height='8' fill='%23222'/%3E%3Crect y='8' width='8' height='8' fill='%23222'/%3E%3C/svg%3E")`

// ── Sub-components ─────────────────────────────────────────────────────────

/** Single frame thumbnail card (draggable) */
function FrameCard({
  frame,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  frame: SpriteFrame
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <Reorder.Item value={frame} id={frame.id}>
      <motion.div
        layout
        onClick={onSelect}
        className={cn(
          "relative group rounded-lg border-2 cursor-pointer overflow-hidden transition-all select-none",
          isSelected ? "border-accent shadow-lg shadow-accent/20" : "border-border hover:border-muted-foreground"
        )}
        style={{ backgroundImage: CHECKER_BG, backgroundSize: "16px 16px" }}
      >
        {/* Frame number badge */}
        <div className="absolute top-1 left-1 z-10 w-4 h-4 rounded bg-background/80 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
          {index + 1}
        </div>

        {/* Drag handle */}
        <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Frame image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frame.dataUrl}
          alt={frame.label}
          className="w-full aspect-square object-contain p-1"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />

        {/* Hover actions */}
        <div className="absolute bottom-0 inset-x-0 flex justify-center gap-1 p-1 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className="p-1 rounded hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function SpritesheetSlicer() {
  const { lang } = useLanguage()

  // ── Frame state ──
  const [frames, setFrames]               = useState<SpriteFrame[]>([])
  const [selectedIdx, setSelectedIdx]     = useState<number>(0)

  // ── AI generation state ──
  const [aiPrompt, setAiPrompt]           = useState("")
  const [aiSize, setAiSize]               = useState("64x64")
  const [aiPalette, setAiPalette]         = useState("default")
  const [aiCount, setAiCount]             = useState(4)
  const [isGenerating, setIsGenerating]   = useState(false)
  const [aiError, setAiError]             = useState<string | null>(null)

  // ── Animation preview ──
  const [isPlaying, setIsPlaying]         = useState(false)
  const [currentFrame, setCurrentFrame]  = useState(0)
  const [fps, setFps]                     = useState(8)
  const intervalRef                       = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Export state ──
  const [cols, setCols]                   = useState(4)
  const [padding, setPadding]             = useState(1)
  const [isExporting, setIsExporting]     = useState(false)
  const [exportError, setExportError]     = useState<string | null>(null)
  const [sheetResult, setSheetResult]     = useState<string | null>(null)
  const [gifResult, setGifResult]         = useState<string | null>(null)
  const [activeTab, setActiveTab]         = useState<"frames"|"settings"|"export">("frames")

  // ── Animation playback ─────────────────────────────────────────────────

  useEffect(() => {
    if (isPlaying && frames.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((f) => (f + 1) % frames.length)
      }, 1000 / fps)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, fps, frames.length])

  const togglePlay = () => {
    if (frames.length < 2) return
    setIsPlaying((p) => !p)
  }

  // ── Frame management ───────────────────────────────────────────────────

  const addFrame = useCallback((dataUrl: string, label = "") => {
    setFrames((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, dataUrl, label: label || `Frame ${prev.length + 1}` },
    ])
  }, [])

  const deleteFrame = (idx: number) => {
    setFrames((prev) => prev.filter((_, i) => i !== idx))
    setSelectedIdx((prev) => Math.max(0, prev > idx ? prev - 1 : prev))
  }

  const duplicateFrame = (idx: number) => {
    const src = frames[idx]
    const copy: SpriteFrame = {
      id: `${Date.now()}-copy`,
      dataUrl: src.dataUrl,
      label: `${src.label} (copy)`,
    }
    setFrames((prev) => [
      ...prev.slice(0, idx + 1),
      copy,
      ...prev.slice(idx + 1),
    ])
  }

  // ── File upload ────────────────────────────────────────────────────────

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        addFrame(dataUrl, file.name.replace(/\.[^.]+$/, ""))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }

  // ── AI generation ──────────────────────────────────────────────────────

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    setAiError(null)

    // Generate `aiCount` sprites sequentially (variation via prompt suffix)
    const variations = [
      "idle pose, facing right",
      "walk step 1, right foot forward",
      "walk step 2, left foot forward",
      "walk step 3, arms swinging",
      "run pose, leaning forward",
      "jump start, crouching",
      "mid-air, arms up",
      "landing pose, knees bent",
    ]

    let successes = 0
    for (let i = 0; i < aiCount; i++) {
      const variation = variations[i % variations.length]
      const framePrompt = `${aiPrompt}, ${variation}`
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: framePrompt,
            size: aiSize,
            palette: aiPalette,
            style: "character",
            removeBackground: true,
          }),
        })
        const data = await res.json()
        if (res.ok && data.success && data.imageUrl) {
          addFrame(data.imageUrl, `Frame ${frames.length + successes + 1}`)
          successes++
        }
      } catch {
        // skip failed frames silently
      }
    }

    if (successes === 0) {
      setAiError(lang === "pt" ? "Nenhum frame gerado" : "No frames generated")
    }
    setIsGenerating(false)
  }

  // ── Apply preset ───────────────────────────────────────────────────────

  const applyPreset = (preset: typeof ANIMATION_PRESETS[0]) => {
    setAiCount(preset.frames)
    setFps(preset.fps)
    setCols(Math.min(preset.frames, 4))
  }

  // ── Export ─────────────────────────────────────────────────────────────

  const handleExport = async (type: "sheet" | "gif" | "both") => {
    if (frames.length === 0) return
    setIsExporting(true)
    setExportError(null)
    setSheetResult(null)
    setGifResult(null)

    const [frameW, frameH] = aiSize.split("x").map(Number)

    try {
      const res = await fetch("/api/spritesheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames: frames.map((f) => f.dataUrl),
          cols,
          frameWidth: frameW,
          frameHeight: frameH,
          fps,
          output: type,
          padding,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Export failed")

      if (data.sheetDataUrl) setSheetResult(data.sheetDataUrl)
      if (data.gifDataUrl)   setGifResult(data.gifDataUrl)
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  const downloadBlob = (dataUrl: string, filename: string) => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const previewFrame = frames[isPlaying ? currentFrame : Math.min(selectedIdx, frames.length - 1)]
  const selectedPalette = PALETTES.find((p) => p.id === aiPalette) || PALETTES[0]

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

      {/* ── LEFT: Preview + frame strip ─────────────────────────────── */}
      <div className="space-y-4">

        {/* Big animation preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">
                {lang === "pt" ? "Prévia da Animação" : "Animation Preview"}
              </h3>
              {frames.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
                  {frames.length} {lang === "pt" ? "frames" : "frames"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{fps} FPS</span>
              <button
                onClick={togglePlay}
                disabled={frames.length < 2}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  frames.length >= 2
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isPlaying
                  ? (lang === "pt" ? "Pausar" : "Pause")
                  : (lang === "pt" ? "Animar" : "Play")}
              </button>
            </div>
          </div>

          {/* Preview canvas */}
          <div
            className="flex items-center justify-center min-h-[320px] relative"
            style={{ backgroundImage: CHECKER_BG, backgroundSize: "20px 20px" }}
          >
            {previewFrame ? (
              <motion.div
                key={previewFrame.id}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFrame.dataUrl}
                  alt="Preview"
                  className="max-h-64 max-w-64 object-contain drop-shadow-2xl"
                  style={{ imageRendering: "pixelated" }}
                />
                {/* Frame counter */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                  {lang === "pt" ? "Frame" : "Frame"} {(isPlaying ? currentFrame : Math.min(selectedIdx, frames.length - 1)) + 1} / {frames.length}
                </div>
              </motion.div>
            ) : (
              <div className="text-center space-y-3 p-8">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mx-auto">
                  <Film className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "pt"
                    ? "Adicione frames para animar"
                    : "Add frames to animate"}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {lang === "pt"
                    ? "Gere com IA ou arraste imagens aqui"
                    : "Generate with AI or drag images here"}
                </p>
              </div>
            )}
          </div>

          {/* Frame scrubber */}
          {frames.length > 0 && (
            <div className="px-4 py-3 border-t border-border flex items-center gap-3">
              <button
                onClick={() => setCurrentFrame((f) => Math.max(0, f - 1))}
                disabled={isPlaying}
                className="p-1 rounded hover:bg-secondary text-muted-foreground disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <Slider
                  value={[isPlaying ? currentFrame : Math.min(selectedIdx, frames.length - 1)]}
                  min={0}
                  max={Math.max(0, frames.length - 1)}
                  step={1}
                  onValueChange={([v]) => {
                    if (!isPlaying) {
                      setCurrentFrame(v)
                      setSelectedIdx(v)
                    }
                  }}
                />
              </div>
              <button
                onClick={() => setCurrentFrame((f) => Math.min(frames.length - 1, f + 1))}
                disabled={isPlaying}
                className="p-1 rounded hover:bg-secondary text-muted-foreground disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Frame Strip ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">
                {lang === "pt" ? "Frames" : "Frames"}
              </h3>
            </div>
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-accent/10 hover:text-accent border border-border hover:border-accent/30 text-muted-foreground transition-all"
            >
              <Upload className="w-3 h-3" />
              {lang === "pt" ? "Importar" : "Import"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {/* Drop zone + frame grid */}
          <div
            className="p-3 min-h-[120px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {frames.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg gap-2 text-muted-foreground">
                <Upload className="w-5 h-5 opacity-40" />
                <p className="text-xs">
                  {lang === "pt" ? "Arraste imagens aqui" : "Drop images here"}
                </p>
              </div>
            ) : (
              <Reorder.Group
                axis="x"
                values={frames}
                onReorder={setFrames}
                className="flex gap-2 flex-wrap"
              >
                {frames.map((frame, idx) => (
                  <div key={frame.id} className="w-16">
                    <FrameCard
                      frame={frame}
                      index={idx}
                      isSelected={selectedIdx === idx}
                      onSelect={() => { setSelectedIdx(idx); setCurrentFrame(idx) }}
                      onDelete={() => deleteFrame(idx)}
                      onDuplicate={() => duplicateFrame(idx)}
                    />
                  </div>
                ))}
              </Reorder.Group>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Controls panel ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Tab bar */}
        <div className="flex border-b border-border">
          {[
            { id: "frames",   icon: Film,      labelEn: "Generate",  labelPt: "Gerar"      },
            { id: "settings", icon: Settings2, labelEn: "Layout",    labelPt: "Layout"     },
            { id: "export",   icon: Download,  labelEn: "Export",    labelPt: "Exportar"   },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all border-b-2",
                activeTab === tab.id
                  ? "border-accent text-accent bg-accent/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {lang === "pt" ? tab.labelPt : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">

            {/* ── TAB: Generate with AI ─────────────────────────────── */}
            {activeTab === "frames" && (
              <motion.div
                key="frames"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* AI badge */}
                <div className="flex items-center gap-1.5 text-[10px] text-accent">
                  <Zap className="w-3 h-3" />
                  <span className="font-semibold">
                    {lang === "pt" ? "GERAÇÃO IA REAL — fal.ai + Flux" : "REAL AI GENERATION — fal.ai + Flux"}
                  </span>
                </div>

                {/* Prompt */}
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    {lang === "pt" ? "Descreva o personagem/objeto" : "Describe the character / object"}
                  </Label>
                  <Textarea
                    placeholder={lang === "pt"
                      ? "Ex: cavaleiro medieval com armadura dourada..."
                      : "E.g. medieval knight with golden armor..."}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[80px] bg-secondary/50 border-border resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAIGenerate()
                    }}
                  />
                </div>

                {/* Animation presets */}
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    {lang === "pt" ? "Preset de animação" : "Animation preset"}
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ANIMATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        className={cn(
                          "text-[10px] px-2 py-1.5 rounded-lg border transition-all text-center",
                          aiCount === preset.frames && fps === preset.fps
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size + frame count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{lang === "pt" ? "Tamanho" : "Frame size"}</Label>
                    <Select value={aiSize} onValueChange={setAiSize}>
                      <SelectTrigger className="bg-secondary/50 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FRAME_SIZES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">
                      {lang === "pt" ? `Frames a gerar: ${aiCount}` : `Frames to generate: ${aiCount}`}
                    </Label>
                    <Slider
                      value={[aiCount]}
                      min={1} max={8} step={1}
                      onValueChange={([v]) => setAiCount(v)}
                    />
                  </div>
                </div>

                {/* Palette */}
                <div className="space-y-1.5">
                  <Label className="text-xs">{lang === "pt" ? "Paleta" : "Palette"}</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PALETTES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setAiPalette(p.id)}
                        className={cn(
                          "p-1.5 rounded-lg border-2 transition-all text-left",
                          aiPalette === p.id ? "border-accent bg-accent/10" : "border-border bg-secondary/30 hover:border-muted-foreground"
                        )}
                      >
                        <div className="flex gap-0.5 mb-0.5">
                          {p.colors.slice(0, 5).map((c, j) => (
                            <div key={j} className="h-2 flex-1 rounded-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-[9px] text-muted-foreground">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {lang === "pt" ? `Gerando ${aiCount} frames...` : `Generating ${aiCount} frames...`}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {lang === "pt" ? `Gerar ${aiCount} frames com IA` : `Generate ${aiCount} frames with AI`}
                    </>
                  )}
                </Button>

                {/* Upload alternative */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="text-[10px] text-muted-foreground bg-card px-2">
                      {lang === "pt" ? "ou importe manualmente" : "or import manually"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-border hover:border-accent/40 hover:bg-accent/5 text-muted-foreground hover:text-accent transition-all text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {lang === "pt" ? "Importar imagens PNG" : "Import PNG images"}
                </button>

                {/* AI error */}
                {aiError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {aiError}
                  </div>
                )}

                {/* Frame summary */}
                {frames.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-xs text-muted-foreground">
                      {frames.length} {lang === "pt" ? "frames carregados" : "frames loaded"}
                    </span>
                    <button
                      onClick={() => { setFrames([]); setCurrentFrame(0); setSelectedIdx(0) }}
                      className="text-[10px] text-destructive hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {lang === "pt" ? "Limpar tudo" : "Clear all"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TAB: Layout settings ──────────────────────────────── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* FPS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{lang === "pt" ? "Velocidade (FPS)" : "Speed (FPS)"}</Label>
                    <span className="text-xs font-mono text-accent">{fps} fps</span>
                  </div>
                  <Slider
                    value={[fps]}
                    min={1} max={30} step={1}
                    onValueChange={([v]) => setFps(v)}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{lang === "pt" ? "Lento (1)" : "Slow (1)"}</span>
                    <span>{lang === "pt" ? "Normal (8)" : "Normal (8)"}</span>
                    <span>{lang === "pt" ? "Rápido (30)" : "Fast (30)"}</span>
                  </div>
                </div>

                {/* Columns */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{lang === "pt" ? "Colunas no sheet" : "Sheet columns"}</Label>
                    <span className="text-xs font-mono text-accent">{cols} col</span>
                  </div>
                  <Slider
                    value={[cols]}
                    min={1} max={Math.max(8, frames.length)} step={1}
                    onValueChange={([v]) => setCols(v)}
                  />
                  {frames.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      {lang === "pt" ? "Layout: " : "Layout: "}
                      {cols}×{Math.ceil(frames.length / cols)} ({frames.length} {lang === "pt" ? "frames" : "frames"})
                    </p>
                  )}
                </div>

                {/* Padding */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{lang === "pt" ? "Espaçamento (px)" : "Padding (px)"}</Label>
                    <span className="text-xs font-mono text-accent">{padding}px</span>
                  </div>
                  <Slider
                    value={[padding]}
                    min={0} max={8} step={1}
                    onValueChange={([v]) => setPadding(v)}
                  />
                </div>

                {/* Sheet preview diagram */}
                {frames.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs">{lang === "pt" ? "Prévia do layout" : "Layout preview"}</Label>
                    <div
                      className="rounded-lg overflow-hidden border border-border bg-secondary/30 p-2"
                      style={{ backgroundImage: CHECKER_BG, backgroundSize: "12px 12px" }}
                    >
                      <div
                        className="grid gap-0.5 mx-auto"
                        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: "200px" }}
                      >
                        {frames.map((frame, idx) => (
                          <div key={frame.id} className="aspect-square rounded-sm overflow-hidden border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={frame.dataUrl}
                              alt={`f${idx}`}
                              className="w-full h-full object-contain"
                              style={{ imageRendering: "pixelated" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Palette preview */}
                <div className="space-y-2">
                  <Label className="text-xs">{lang === "pt" ? "Paleta ativa" : "Active palette"}</Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex gap-1">
                      {selectedPalette.colors.map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{selectedPalette.name}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB: Export ───────────────────────────────────────── */}
            {activeTab === "export" && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {frames.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <Image className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {lang === "pt"
                        ? "Adicione frames na aba Gerar primeiro"
                        : "Add frames in the Generate tab first"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1">
                      <p className="text-xs font-medium">{lang === "pt" ? "Resumo" : "Summary"}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{lang === "pt" ? "Frames:" : "Frames:"}</span>
                        <span className="text-foreground">{frames.length}</span>
                        <span>{lang === "pt" ? "Tamanho:" : "Frame size:"}</span>
                        <span className="text-foreground">{aiSize}</span>
                        <span>{lang === "pt" ? "Colunas:" : "Columns:"}</span>
                        <span className="text-foreground">{cols}</span>
                        <span>FPS:</span>
                        <span className="text-foreground">{fps}</span>
                      </div>
                    </div>

                    {/* Export buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleExport("sheet")}
                        disabled={isExporting}
                        variant="outline"
                        className="w-full border-border justify-start gap-3 h-12"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <Grid3X3 className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-medium">PNG Sprite Sheet</p>
                          <p className="text-[10px] text-muted-foreground">
                            {lang === "pt" ? "Todos os frames em uma imagem" : "All frames in one image"}
                          </p>
                        </div>
                      </Button>

                      <Button
                        onClick={() => handleExport("gif")}
                        disabled={isExporting}
                        variant="outline"
                        className="w-full border-border justify-start gap-3 h-12"
                      >
                        <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                          <Film className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-medium">Animated GIF</p>
                          <p className="text-[10px] text-muted-foreground">
                            {lang === "pt" ? "Animação em loop pronta" : "Ready-to-share looping animation"}
                          </p>
                        </div>
                      </Button>

                      <Button
                        onClick={() => handleExport("both")}
                        disabled={isExporting}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground justify-start gap-3 h-12"
                      >
                        {isExporting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-xs font-medium">
                            {isExporting
                              ? (lang === "pt" ? "Processando..." : "Processing...")
                              : (lang === "pt" ? "Exportar tudo (PNG + GIF)" : "Export both (PNG + GIF)")}
                          </p>
                          <p className="text-[10px] opacity-70">
                            {lang === "pt" ? "Sheet + GIF animado" : "Sprite sheet + animated GIF"}
                          </p>
                        </div>
                      </Button>
                    </div>

                    {/* Export error */}
                    {exportError && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {exportError}
                      </div>
                    )}

                    {/* Results */}
                    <AnimatePresence>
                      {(sheetResult || gifResult) && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2 text-xs text-accent font-medium">
                            <Check className="w-4 h-4" />
                            {lang === "pt" ? "Pronto para baixar!" : "Ready to download!"}
                          </div>

                          {sheetResult && (
                            <div className="rounded-xl border border-border overflow-hidden">
                              <div
                                className="p-3 flex items-center justify-center min-h-[80px]"
                                style={{ backgroundImage: CHECKER_BG, backgroundSize: "12px 12px" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={sheetResult}
                                  alt="Sprite sheet"
                                  className="max-h-[120px] max-w-full object-contain"
                                  style={{ imageRendering: "pixelated" }}
                                />
                              </div>
                              <div className="p-2 bg-card border-t border-border">
                                <Button
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                                  onClick={() => downloadBlob(sheetResult, `pixeldoxa-sheet-${cols}x${Math.ceil(frames.length / cols)}-${Date.now()}.png`)}
                                >
                                  <Download className="w-3 h-3 mr-1.5" />
                                  {lang === "pt" ? "Baixar PNG Sheet" : "Download PNG Sheet"}
                                </Button>
                              </div>
                            </div>
                          )}

                          {gifResult && (
                            <div className="rounded-xl border border-border overflow-hidden">
                              <div
                                className="p-3 flex items-center justify-center min-h-[80px]"
                                style={{ backgroundImage: CHECKER_BG, backgroundSize: "12px 12px" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={gifResult}
                                  alt="Animated GIF"
                                  className="max-h-[120px] max-w-full object-contain"
                                  style={{ imageRendering: "pixelated" }}
                                />
                              </div>
                              <div className="p-2 bg-card border-t border-border">
                                <Button
                                  size="sm"
                                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                                  onClick={() => downloadBlob(gifResult, `pixeldoxa-animated-${fps}fps-${Date.now()}.gif`)}
                                >
                                  <Download className="w-3 h-3 mr-1.5" />
                                  {lang === "pt" ? "Baixar GIF Animado" : "Download Animated GIF"}
                                </Button>
                              </div>
                            </div>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-border text-xs"
                            onClick={() => handleExport("both")}
                          >
                            <RefreshCw className="w-3 h-3 mr-1.5" />
                            {lang === "pt" ? "Regerar" : "Regenerate"}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
