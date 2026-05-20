"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Wand2, RefreshCw, Download, Check,
  AlertCircle, ImageIcon, Zap, Loader2, ExternalLink,
  WalletMinimal, Clock, Gauge, Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

// ── Config ─────────────────────────────────────────────────────────────────
const SIZES = ["16x16", "32x32", "64x64", "128x128", "256x256"]

const PALETTES = [
  { id: "default",   name: "Default",  colors: ["#1a1c2c","#5d275d","#b13e53","#ef7d57","#ffcd75","#a7f070","#38b764","#257179"] },
  { id: "gameboy",   name: "GameBoy",  colors: ["#0f380f","#306230","#8bac0f","#9bbc0f"] },
  { id: "nes",       name: "NES",      colors: ["#7c7c7c","#0000fc","#0078f8","#fcbcb0"] },
  { id: "pico8",     name: "PICO-8",   colors: ["#000000","#1d2b53","#7e2553","#008751","#ab5236","#5f574f","#c2c3c7","#fff1e8"] },
  { id: "endesga32", name: "Endesga",  colors: ["#be4a2f","#d77643","#ead4aa","#e4a672","#b86f50","#733e39","#3e2731","#a22633"] },
  { id: "monokai",   name: "Monokai",  colors: ["#272822","#75715e","#f8f8f2","#66d9e8","#a6e22e","#f92672","#fd971f","#ae81ff"] },
]

const SPRITE_TYPES = [
  { id: "character", label: "Character" },
  { id: "item",      label: "Item / Object" },
  { id: "enemy",     label: "Enemy" },
  { id: "npc",       label: "NPC" },
  { id: "tile",      label: "Tile" },
  { id: "icon",      label: "Icon" },
]

const EXAMPLE_PROMPTS = [
  "A brave knight with golden armor and a glowing sword",
  "A cute slime enemy with big eyes and a crown",
  "A wise old wizard with a purple robe and staff",
  "A treasure chest with golden coins overflowing",
  "Magic fire spell effect, orange and red flames",
  "Ancient stone dungeon floor tile, mossy",
]

type Tier = "free" | "pro"

// ── Component ───────────────────────────────────────────────────────────────
export function AIGenerationPanel() {
  const { lang } = useLanguage()

  const [prompt, setPrompt]                     = useState("")
  const [size, setSize]                         = useState("64x64")
  const [palette, setPalette]                   = useState("default")
  const [spriteType, setSpriteType]             = useState("character")
  const [removeBackground, setRemoveBackground] = useState(true)
  const [tier, setTier]                         = useState<Tier>("free")

  const [isGenerating, setIsGenerating]         = useState(false)
  const [generatedImage, setGeneratedImage]     = useState<string | null>(null)
  const [error, setError]                       = useState<string | null>(null)
  const [copied, setCopied]                     = useState(false)
  const [generationTime, setGenerationTime]     = useState<number | null>(null)
  const [usedProvider, setUsedProvider]         = useState<string | null>(null)
  const [errorType, setErrorType]               = useState<"balance" | "timeout" | "generic" | null>(null)

  const selectedPaletteData = PALETTES.find(p => p.id === palette) || PALETTES[0]

  // ── Classify errors ────────────────────────────────────────────────────
  const classifyError = (msg: string): "balance" | "timeout" | "generic" => {
    const m = msg.toLowerCase()
    if (
      m.includes("exhausted") || m.includes("balance") || m.includes("billing") ||
      m.includes("locked") || m.includes("forbidden") || m.includes("403") ||
      m.includes("unauthorized") || m.includes("401")
    ) return "balance"
    if (m.includes("timeout") || m.includes("timed out")) return "timeout"
    return "generic"
  }

  // ── Generate ───────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    setErrorType(null)
    setGeneratedImage(null)
    setGenerationTime(null)
    setUsedProvider(null)
    const start = Date.now()

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size,
          palette,
          style: spriteType,
          removeBackground,
          tier,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed")
      setGeneratedImage(data.imageUrl)
      setGenerationTime(Math.round((Date.now() - start) / 1000))
      setUsedProvider(data.provider ?? tier)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      setErrorType(classifyError(msg))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const a = document.createElement("a")
    a.href = generatedImage
    a.download = `pixeldoxa-${spriteType}-${size}-${Date.now()}.png`
    a.target = "_blank"
    a.click()
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Tier descriptions ──────────────────────────────────────────────────
  const tierInfo = {
    free: {
      label:    lang === "pt" ? "Grátis" : "Free",
      speed:    lang === "pt" ? "~15-30s" : "~15-30s",
      desc:     lang === "pt" ? "Pollinations.ai · Sem custo · Ilimitado" : "Pollinations.ai · No cost · Unlimited",
      bgColor:  "bg-emerald-500/10",
      border:   "border-emerald-500/30",
      text:     "text-emerald-400",
      icon:     Zap,
    },
    pro: {
      label:    lang === "pt" ? "Pro" : "Pro",
      speed:    lang === "pt" ? "~3-5s" : "~3-5s",
      desc:     lang === "pt" ? "fal.ai · Remoção de fundo · Mais rápido" : "fal.ai · Background removal · Faster",
      bgColor:  "bg-violet-500/10",
      border:   "border-violet-500/30",
      text:     "text-violet-400",
      icon:     Crown,
    },
  }

  const currentTier = tierInfo[tier]
  const TierIcon = currentTier.icon

  // ── Loading messages by tier ───────────────────────────────────────────
  const loadingSteps = tier === "free"
    ? (lang === "pt"
        ? ["Conectando ao Pollinations.ai...", "Gerando pixel art...", "Aplicando paleta...", "Quase pronto..."]
        : ["Connecting to Pollinations.ai...", "Generating pixel art...", "Applying palette...", "Almost done..."])
    : (lang === "pt"
        ? ["Conectando ao fal.ai...", "Gerando com Flux Schnell...", "Removendo fundo...", "Processando pixels..."]
        : ["Connecting to fal.ai...", "Generating with Flux Schnell...", "Removing background...", "Processing pixels..."])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Generation Panel</h3>
            <p className="text-xs text-muted-foreground">
              {tier === "free"
                ? (lang === "pt" ? "Grátis · Pollinations.ai + Flux" : "Free · Pollinations.ai + Flux")
                : (lang === "pt" ? "Pro · fal.ai + Flux Schnell" : "Pro · fal.ai + Flux Schnell")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
          <Zap className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-bold text-accent">LIVE</span>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* ── FREE / PRO Tier Selector ── */}
        <div className="grid grid-cols-2 gap-2">
          {(["free", "pro"] as Tier[]).map((t) => {
            const info = tierInfo[t]
            const Icon = info.icon
            const isActive = tier === t
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  "relative flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left",
                  isActive
                    ? `${info.bgColor} ${info.border}`
                    : "border-border bg-secondary/20 hover:border-muted-foreground/50"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn("w-3.5 h-3.5", isActive ? info.text : "text-muted-foreground")} />
                  <span className={cn("text-xs font-bold", isActive ? info.text : "text-muted-foreground")}>
                    {info.label}
                  </span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">{info.speed}</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">{info.desc}</p>
                {isActive && (
                  <motion.div
                    layoutId="tier-active"
                    className={cn("absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full", info.text.replace("text-", "bg-"))}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Pro info note */}
        {tier === "pro" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/20 text-[10px] text-muted-foreground"
          >
            <WalletMinimal className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
            <span>
              {lang === "pt"
                ? "Pro usa fal.ai (pago). Configure FAL_KEY no Vercel + créditos em "
                : "Pro uses fal.ai (paid). Configure FAL_KEY in Vercel + add credits at "}
              <a href="https://fal.ai/dashboard/billing" target="_blank" rel="noopener noreferrer"
                className="text-violet-400 hover:underline">
                fal.ai/dashboard/billing
              </a>
            </span>
          </motion.div>
        )}

        {/* ── Prompt ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt">
              {lang === "pt" ? "Descreva seu asset" : "Describe your asset"}
            </Label>
            <button
              onClick={handleCopyPrompt}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {copied && <Check className="w-3 h-3 text-accent" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <Textarea
            id="prompt"
            placeholder={
              lang === "pt"
                ? "Ex: Um guerreiro medieval com armadura dourada e espada flamejante..."
                : "E.g. A medieval warrior with golden armor and a flaming sword..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[90px] bg-secondary/50 border-border resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
            }}
          />
          {/* Quick example prompts */}
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.slice(0, 3).map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-[10px] px-2 py-1 rounded-full bg-secondary hover:bg-accent/10 hover:text-accent border border-border hover:border-accent/30 text-muted-foreground transition-all"
              >
                {ex.split(" ").slice(0, 4).join(" ")}…
              </button>
            ))}
          </div>
        </div>

        {/* ── Size + Sprite Type ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">{lang === "pt" ? "Tamanho" : "Size"}</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="bg-secondary/50 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{lang === "pt" ? "Tipo" : "Sprite Type"}</Label>
            <Select value={spriteType} onValueChange={setSpriteType}>
              <SelectTrigger className="bg-secondary/50 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPRITE_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Palette ── */}
        <div className="space-y-1.5">
          <Label className="text-xs">{lang === "pt" ? "Paleta de Cores" : "Color Palette"}</Label>
          <div className="grid grid-cols-3 gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                className={cn(
                  "p-2 rounded-lg border-2 transition-all text-left",
                  palette === p.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/30 hover:border-muted-foreground"
                )}
              >
                <div className="flex gap-0.5 mb-1">
                  {p.colors.slice(0, 6).map((color, j) => (
                    <div key={j} className="h-3 flex-1 rounded-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Remove Background toggle (Pro only note) ── */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-medium flex items-center gap-1.5">
              {lang === "pt" ? "Remover fundo" : "Remove background"}
              {tier === "free" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">
                  {lang === "pt" ? "Pro apenas" : "Pro only"}
                </span>
              )}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {tier === "free"
                ? (lang === "pt" ? "Disponível no plano Pro (fal.ai)" : "Available on Pro plan (fal.ai)")
                : (lang === "pt" ? "PNG transparente para game engine" : "Transparent PNG for game engine")}
            </p>
          </div>
          <button
            onClick={() => tier === "pro" && setRemoveBackground(!removeBackground)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-200",
              tier === "free"
                ? "bg-secondary border border-border opacity-40 cursor-not-allowed"
                : removeBackground ? "bg-accent" : "bg-secondary border border-border"
            )}
          >
            <motion.div
              animate={{ x: (tier === "pro" && removeBackground) ? 20 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
            />
          </button>
        </div>

        {/* ── Generate Button ── */}
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
              {tier === "free"
                ? (lang === "pt" ? "Gerando grátis..." : "Generating free...")
                : (lang === "pt" ? "Gerando Pro..." : "Generating Pro...")}
            </>
          ) : (
            <>
              <TierIcon className="w-4 h-4 mr-2" />
              {lang === "pt" ? `Gerar Pixel Art · ${currentTier.label}` : `Generate Pixel Art · ${currentTier.label}`}
            </>
          )}
        </Button>
        <p className="text-[10px] text-center text-muted-foreground -mt-2">
          {lang === "pt" ? "Ctrl/⌘ + Enter para gerar" : "Ctrl/⌘ + Enter to generate"}
          {tier === "free" && (
            <span className="ml-2 text-emerald-500">
              · {lang === "pt" ? "100% gratuito" : "100% free"}
            </span>
          )}
        </p>

        {/* ── Result Area ── */}
        <AnimatePresence mode="wait">

          {/* Loading */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border p-6 flex flex-col items-center gap-3",
                tier === "free"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-violet-500/20 bg-violet-500/5"
              )}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-secondary/80 flex items-center justify-center">
                  <Loader2 className={cn(
                    "w-8 h-8 animate-spin",
                    tier === "free" ? "text-emerald-400" : "text-violet-400"
                  )} />
                </div>
                <motion.div
                  className={cn(
                    "absolute -inset-1 rounded-xl border-2",
                    tier === "free" ? "border-emerald-500/40" : "border-violet-500/40"
                  )}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              {/* Animated step text */}
              <div className="text-center">
                <motion.p
                  key={loadingSteps[0]}
                  className={cn(
                    "text-sm font-medium",
                    tier === "free" ? "text-emerald-400" : "text-violet-400"
                  )}
                >
                  {tier === "free"
                    ? (lang === "pt" ? "Gerando grátis com Pollinations.ai..." : "Generating free with Pollinations.ai...")
                    : (lang === "pt" ? "Gerando Pro com fal.ai..." : "Generating Pro with fal.ai...")}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tier === "free"
                    ? (lang === "pt" ? "Pode levar 15-30 segundos" : "May take 15-30 seconds")
                    : (lang === "pt" ? "Gerando • Removendo fundo • Processando" : "Generating • Removing background • Processing")}
                </p>
              </div>

              {/* Speed indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {tier === "free"
                    ? (lang === "pt" ? "Modo Gratuito · ~15-30s" : "Free Mode · ~15-30s")
                    : (lang === "pt" ? "Modo Pro · ~3-5s" : "Pro Mode · ~3-5s")}
                </span>
              </div>

              {/* Pixel dots animation */}
              <div className="flex gap-1">
                {[0,1,2,3,4,5,6,7].map((i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-sm",
                      tier === "free" ? "bg-emerald-500" : "bg-violet-500"
                    )}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && !isGenerating && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border p-4",
                errorType === "balance"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-destructive/30 bg-destructive/5"
              )}
            >
              {errorType === "balance" ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <WalletMinimal className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-400">
                        {lang === "pt" ? "Geração Pro indisponível" : "Pro generation unavailable"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {lang === "pt"
                          ? "Saldo da conta fal.ai esgotado. Use o modo Grátis enquanto isso, ou recarregue créditos."
                          : "fal.ai account balance exhausted. Use Free mode in the meantime, or top up credits."}
                      </p>
                    </div>
                  </div>
                  <div className="pl-12 space-y-2">
                    <button
                      onClick={() => { setTier("free"); setError(null); setErrorType(null) }}
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition-all"
                    >
                      <Zap className="w-3 h-3" />
                      {lang === "pt" ? "Mudar para modo Grátis agora" : "Switch to Free mode now"}
                    </button>
                    <a
                      href="https://fal.ai/dashboard/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {lang === "pt" ? "Recarregar em fal.ai/dashboard/billing" : "Top up at fal.ai/dashboard/billing"}
                    </a>
                  </div>
                  <div className="ml-12 p-2 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-[10px] text-muted-foreground">
                      <span className="text-accent font-medium">💡 {lang === "pt" ? "Dica:" : "Tip:"}</span>{" "}
                      {lang === "pt"
                        ? "$5 de crédito gera ~600 imagens. Flux Schnell custa ~$0.003/imagem."
                        : "$5 in credits generates ~600 images. Flux Schnell costs ~$0.003/image."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      {lang === "pt" ? "Erro na geração" : "Generation error"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {errorType === "timeout"
                        ? (lang === "pt" ? "A geração demorou muito. Tente novamente." : "Generation timed out. Please try again.")
                        : error}
                    </p>
                    <button
                      onClick={handleGenerate}
                      className="text-xs text-accent hover:underline mt-2 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {lang === "pt" ? "Tentar novamente" : "Try again"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Generated image */}
          {generatedImage && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-xl border border-accent/30 bg-secondary/30 overflow-hidden"
            >
              {/* Checkerboard bg */}
              <div
                className="relative flex items-center justify-center p-8 min-h-[180px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3Crect x='10' width='10' height='10' fill='%23222'/%3E%3Crect y='10' width='10' height='10' fill='%23222'/%3E%3C/svg%3E")`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage}
                  alt="Generated pixel art"
                  className="max-w-full max-h-48 object-contain drop-shadow-2xl"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold shadow-lg">
                  <Check className="w-3 h-3" />
                  {lang === "pt" ? "Pronto!" : "Done!"}
                </div>
                {generationTime && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 text-muted-foreground text-[10px] backdrop-blur-sm">
                    <Clock className="w-2.5 h-2.5" />
                    {generationTime}s
                    {usedProvider && (
                      <span className={cn(
                        "ml-1 font-medium",
                        usedProvider === "pollinations" ? "text-emerald-400" : "text-violet-400"
                      )}>
                        · {usedProvider === "pollinations" ? "Free" : "Pro"}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions bar */}
              <div className="p-3 border-t border-border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {selectedPaletteData.colors.slice(0, 5).map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedPaletteData.name} · {size}
                    </span>
                  </div>
                  {tier === "pro" && removeBackground && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      {lang === "pt" ? "Transparente" : "Transparent"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-8"
                  >
                    <Download className="w-3 h-3 mr-1.5" />
                    {lang === "pt" ? "Baixar PNG" : "Download PNG"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerate}
                    title={lang === "pt" ? "Gerar novamente" : "Regenerate"}
                    className="h-8 px-3 border-border"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!generatedImage && !isGenerating && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-border bg-secondary/20 p-6 flex flex-col items-center gap-2"
            >
              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground text-center">
                {lang === "pt"
                  ? "Seu pixel art gerado aparecerá aqui"
                  : "Your generated pixel art will appear here"}
              </p>
              <p className="text-[10px] text-muted-foreground/60 text-center">
                {tier === "free"
                  ? (lang === "pt" ? "✓ Grátis · Sem limite · Sem cadastro" : "✓ Free · Unlimited · No sign-up")
                  : (lang === "pt" ? "⚡ Mais rápido · Remoção de fundo · fal.ai" : "⚡ Faster · Background removal · fal.ai")}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}
