"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Grid3X3, Wand2, Layers, Gamepad2, Star, Check, ArrowRight,
  Zap, Download, ChevronDown, Menu, X, Play, Code2, Package,
  Globe, Users, Film, Lightbulb, MessageSquareText
} from "lucide-react"

// ─── Pixel Art Sprites (Pure CSS/JS, zero dependencies) ───────────────
const COLORS = {
  cyan:   "#00d4ff",
  purple: "#a855f7",
  green:  "#22c55e",
  orange: "#f97316",
  yellow: "#eab308",
  pink:   "#ec4899",
  teal:   "#14b8a6",
  white:  "#f0f0f0",
  dark:   "#1a1a2e",
  skin:   "#f4a261",
  gold:   "#fbbf24",
  red:    "#ef4444",
}

type SpriteData = {
  grid: number[][]
  palette: string[]
  label: string
}

const SPRITES: SpriteData[] = [
  {
    label: "Drifter",
    palette: ["transparent", "#1a0a2e", "#6b21a8", "#a855f7", "#c4b5fd", "#f4a261", "#fed7aa", "#fbbf24"],
    grid: [
      [0,0,0,1,1,1,0,0],
      [0,0,1,2,2,2,1,0],
      [0,1,2,3,3,3,2,1],
      [0,0,1,5,6,5,1,0],
      [0,0,2,4,4,4,2,0],
      [0,1,2,3,2,3,2,1],
      [0,1,2,0,0,0,2,1],
      [0,1,1,0,0,0,1,1],
    ],
  },
  {
    label: "Mage",
    palette: ["transparent", "#0c1a3a", "#1d4ed8", "#3b82f6", "#93c5fd", "#f4a261", "#fed7aa", "#fbbf24"],
    grid: [
      [0,0,1,7,7,1,0,0],
      [0,1,2,5,5,2,1,0],
      [0,1,3,3,3,3,1,0],
      [0,0,1,5,6,5,1,0],
      [0,0,3,4,4,4,3,0],
      [0,1,3,2,2,2,3,1],
      [0,0,3,0,0,0,3,0],
      [0,0,1,0,0,0,1,0],
    ],
  },
  {
    label: "Warrior",
    palette: ["transparent", "#1c1917", "#78350f", "#d97706", "#fbbf24", "#f4a261", "#fed7aa", "#e5e7eb"],
    grid: [
      [0,0,4,4,4,4,0,0],
      [0,1,3,5,5,3,1,0],
      [0,1,3,3,3,3,1,0],
      [0,0,1,5,6,5,1,0],
      [0,7,3,2,2,2,3,7],
      [0,1,3,1,1,1,3,1],
      [0,0,1,1,0,1,1,0],
      [0,0,1,0,0,0,1,0],
    ],
  },
  {
    label: "Rogue",
    palette: ["transparent", "#0f172a", "#1e3a5f", "#164e63", "#22c55e", "#f4a261", "#fed7aa", "#fbbf24"],
    grid: [
      [0,0,1,1,1,1,0,0],
      [0,1,3,5,5,3,1,0],
      [0,1,4,4,4,4,1,0],
      [0,0,1,5,6,5,1,0],
      [0,0,4,2,2,2,4,0],
      [7,1,4,3,3,3,4,1],
      [0,0,1,1,0,1,1,0],
      [0,0,1,0,0,0,1,0],
    ],
  },
  {
    label: "Healer",
    palette: ["transparent", "#3b0764", "#7c3aed", "#a78bfa", "#ddd6fe", "#f4a261", "#fed7aa", "#ec4899"],
    grid: [
      [0,0,0,3,3,0,0,0],
      [0,0,3,5,5,3,0,0],
      [0,0,4,4,4,4,0,0],
      [0,0,1,5,6,5,1,0],
      [0,7,4,2,2,2,4,7],
      [0,1,4,3,3,3,4,1],
      [0,0,3,1,0,1,3,0],
      [0,0,1,0,0,0,1,0],
    ],
  },
  {
    label: "Knight",
    palette: ["transparent", "#1f2937", "#374151", "#6b7280", "#d1d5db", "#f4a261", "#fed7aa", "#fbbf24"],
    grid: [
      [0,1,3,3,3,3,1,0],
      [0,1,4,5,5,4,1,0],
      [0,1,4,4,4,4,1,0],
      [0,0,1,5,6,5,1,0],
      [0,4,4,2,2,2,4,4],
      [0,1,4,1,1,1,4,1],
      [0,0,4,1,0,1,4,0],
      [0,0,1,0,0,0,1,0],
    ],
  },
]

function PixelSprite({ data, pixelSize = 6 }: { data: SpriteData; pixelSize?: number }) {
  return (
    <div style={{ display: "inline-block" }}>
      {data.grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((colorIdx, x) => (
            <div
              key={x}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: data.palette[colorIdx] || "transparent",
                imageRendering: "pixelated",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Animated Sprite Showcase ──────────────────────────────────────────
function FloatingSprite({ data, delay = 0, pixelSize = 5 }: { data: SpriteData; delay?: number; pixelSize?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
      className="flex flex-col items-center gap-2"
    >
      <div className="p-3 bg-card border border-border rounded-xl hover:border-accent/50 transition-all duration-300 cursor-pointer group">
        <div className="group-hover:scale-110 transition-transform duration-200">
          <PixelSprite data={data} pixelSize={pixelSize} />
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{data.label}</span>
    </motion.div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = ["Recursos", "Galeria", "Docs", "Preços"]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Grid3X3 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">
          Pixel<span className="text-accent">Doxa</span>
        </span>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent border border-accent/30">
          BETA
        </span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            {link}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-3">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Entrar
        </a>
        <motion.a
          href="#"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors glow-accent"
        >
          Começar Grátis
        </motion.a>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-2 rounded-lg bg-secondary"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 glass border-b border-border p-4 flex flex-col gap-2 md:hidden"
          >
            {links.map((link) => (
              <a key={link} href="#" className="px-3 py-2 text-sm hover:text-accent transition-colors">
                {link}
              </a>
            ))}
            <a href="#" className="mt-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium text-center">
              Começar Grátis
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ─── Hero Section ──────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic background image */}
      <div className="absolute inset-0">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%282%29-vecuQBPhE0488jXJmfrqK7YNwDRJ0V.png"
          alt="Epic fantasy pixel art landscape"
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/20" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${8 + i * 6}%`,
              backgroundColor: i % 2 === 0 ? "hsl(180 80% 45% / 0.5)" : "hsl(270 60% 65% / 0.4)",
            }}
            animate={{ y: ["100vh", "-20px"], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-accent/30"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Pipeline Profissional de Pixel Art</span>
            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full font-medium">Studio</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent via-primary to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                <Grid3X3 className="w-7 h-7 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-sm"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Pixel<span className="text-accent">Doxa</span>
              </h2>
              <p className="text-xs text-muted-foreground">Pixel Art Studio Profissional</p>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Pipeline Profissional de{" "}
            <span className="text-accent text-glow">Pixel Art</span>{" "}
            para Jogos Indie
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl"
          >
            Gere personagens, sprites, tilesets e mundos procedurais com IA.
            Exporte diretamente para Godot, Unity e GameMaker.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-base transition-colors glow-accent group"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:border-accent/50 bg-secondary/50 hover:bg-secondary text-foreground font-semibold text-base transition-all"
            >
              <Play className="w-4 h-4" />
              View Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { value: "10k+", label: "Assets gerados" },
              { value: "500+", label: "Devs indie" },
              { value: "3", label: "Engines suportadas" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}

// ─── Character Showcase ────────────────────────────────────────────────
function CharacterShowcase() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(180 80% 45%) 1px, transparent 1px), linear-gradient(to bottom, hsl(180 80% 45%) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/20"
          >
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Character Generation</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Personagens prontos para{" "}
            <span className="text-accent">gameplay real</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Sprites com spritesheets completos — walk cycle, ataque, idle, hurt. Prontos para importar na sua engine.
          </motion.p>
        </div>

        {/* Sprite gallery */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {SPRITES.map((sprite, i) => (
            <motion.div
              key={sprite.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <FloatingSprite data={sprite} delay={i * 0.3} pixelSize={6} />
            </motion.div>
          ))}
        </div>

        {/* Generation UI mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">PixelDoxa — Sprite Generator</span>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
            {/* Prompt input */}
            <div>
              <div className="text-xs text-accent font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Prompt Criativo
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl border border-border mb-4 text-sm leading-relaxed">
                <span className="text-foreground font-medium">"Guerreiro místico</span>{" "}
                <span className="text-muted-foreground">com</span>{" "}
                <span className="text-cyan-400">capa azul luminosa</span>
                <span className="text-muted-foreground">, armadura leve dourada,</span>{" "}
                <span className="text-purple-400">dark fantasy</span>
                <span className="text-muted-foreground">, 32x32px,</span>{" "}
                <span className="text-foreground font-medium">4 direções"</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Personagem", "4 direções", "32x32", "Dark Fantasy", "Spritesheet"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-lg border border-accent/30 bg-accent/10 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium text-sm flex items-center justify-center gap-2 glow-accent"
              >
                <Wand2 className="w-4 h-4" />
                Gerar Sprite
              </motion.button>
            </div>

            {/* Result preview */}
            <div className="flex flex-col items-center">
              <div className="p-8 bg-secondary/30 rounded-xl border border-border mb-4 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <PixelSprite data={SPRITES[0]} pixelSize={10} />
                </motion.div>
              </div>
              <div className="flex gap-2 w-full">
                {["PNG", "GIF", "Aseprite", "Godot"].map((fmt) => (
                  <button
                    key={fmt}
                    className="flex-1 py-1.5 text-xs rounded-lg border border-border bg-secondary/50 hover:border-accent/50 hover:bg-secondary transition-all"
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Workflow Section ──────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    step: "01",
    icon: Lightbulb,
    title: "Imagine",
    subtitle: "Descreva o que precisa",
    description: "Escreva um prompt detalhado — personagem, estilo visual, cores, animações. A IA entende linguagem natural.",
    color: "hsl(38 92% 60%)",
  },
  {
    step: "02",
    icon: Wand2,
    title: "Gere",
    subtitle: "IA processa e cria",
    description: "O modelo gera o sprite, spritesheet ou tileset com as especificações exatas — resolução, paleta, estilo.",
    color: "hsl(180 80% 45%)",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Refine",
    subtitle: "Editor visual integrado",
    description: "Ajuste pixel a pixel com o editor integrado. Modifique paleta, frames de animação e variações.",
    color: "hsl(270 60% 65%)",
  },
  {
    step: "04",
    icon: Download,
    title: "Exporte",
    subtitle: "Game-ready assets",
    description: "Exporte PNG, GIF, Spritesheet, Aseprite ou pacotes nativos para Godot, Unity e GameMaker.",
    color: "hsl(142 70% 45%)",
  },
]

function WorkflowSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-primary/20"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Animation Pipeline</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Do conceito ao asset em{" "}
            <span className="text-accent">4 etapas</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Um pipeline completo. Sem sair da plataforma.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = step.icon
            const isActive = active === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActive(i)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-card border-accent shadow-lg shadow-accent/10"
                    : "bg-card/50 border-border hover:border-accent/40 hover:bg-card/80"
                }`}
              >
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                    isActive ? "bg-accent/20" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${isActive ? "text-accent" : "text-muted-foreground"}`}
                  />
                </div>

                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-xs text-accent mb-2">{step.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                {isActive && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-2xl border-2 border-accent pointer-events-none"
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Features Grid ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Wand2,
    title: "Sprite Generation",
    description: "Personagens únicos a partir de descrições textuais detalhadas. Variações, expressões, poses.",
  },
  {
    icon: Film,
    title: "Animation Pipeline",
    description: "Walk cycles, ataques, idle e estados completos. Spritesheet automático com timing ajustável.",
  },
  {
    icon: Grid3X3,
    title: "Tileset Workflow",
    description: "Tilesets seamless para level design com auto-tiling integrado. Forest, dungeon, village.",
  },
  {
    icon: Gamepad2,
    title: "Engine Integration",
    description: "Exporte para Godot, Unity, GameMaker com formatos nativos. Sem reconfiguração manual.",
  },
  {
    icon: Globe,
    title: "Procedural Gen",
    description: "Mapas, dungeons e mundos gerados com Wave Function Collapse. Estrutura controlada.",
  },
  {
    icon: Star,
    title: "Asset Marketplace",
    description: "Biblioteca compartilhada. Assets de outros devs, style packs, NPC libraries. Em breve.",
  },
]

function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/20"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Ferramentas Profissionais</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Pipeline completo de{" "}
            <span className="text-accent">produção de assets</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Ferramentas profissionais de criação, animação e exportação para desenvolvedores indie
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 bg-card border border-border rounded-xl hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Export System ─────────────────────────────────────────────────────
const EXPORT_FORMATS = [
  { name: "PNG", desc: "Sprite individual ou spritesheet", color: "#22c55e", icon: "🖼️" },
  { name: "GIF", desc: "Animação pronta para web", color: "#3b82f6", icon: "🎞️" },
  { name: "Sprite Sheet", desc: "Grid formatado para engines", color: "#8b5cf6", icon: "📐" },
  { name: "Aseprite", desc: "Arquivo nativo editável", color: "#f97316", icon: "✏️" },
  { name: "Godot Package", desc: "Scene + SpriteFrames prontos", color: "#478cbf", icon: "🎮" },
  { name: "Unity Package", desc: "Prefab com sprite atlas", color: "#222c37", icon: "🎲" },
]

function ExportSection() {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-green-500/20"
          >
            <Download className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Export System</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Exporte para sua{" "}
            <span className="text-accent">engine favorita</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Compatível com Godot, Unity, GameMaker, RPG Maker, Aseprite e mais.
            Sem configuração manual.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_FORMATS.map((fmt, i) => (
            <motion.div
              key={fmt.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-accent/40 transition-all cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: fmt.color + "20", border: `1px solid ${fmt.color}40` }}
              >
                {fmt.icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{fmt.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{fmt.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engine logos mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-card border border-border rounded-2xl"
        >
          <div className="text-center mb-6">
            <span className="text-sm text-muted-foreground">Engine Integration</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {[
              { name: "Godot", color: "#478CBF" },
              { name: "Unity", color: "#9b9b9b" },
              { name: "GameMaker", color: "#8BC34A" },
              { name: "RPG Maker", color: "#FF5722" },
              { name: "Aseprite", color: "#7B5EA7" },
              { name: "GMS2", color: "#F4CE14" },
            ].map((engine) => (
              <div
                key={engine.name}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/50"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: engine.color }}
                />
                <span className="text-sm font-medium">{engine.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing Section ───────────────────────────────────────────────────
const PLANS = [
  {
    name: "Free",
    price: "R$0",
    period: "/mês",
    desc: "Para experimentar",
    features: ["50 gerações/mês", "Resolução até 64x64", "Formato PNG básico", "Comunidade"],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$49",
    period: "/mês",
    desc: "Para desenvolvedores indie",
    features: ["Gerações ilimitadas", "Até 256x256", "Todos os formatos", "Spritesheets", "Animações", "Sem marca d'água"],
    cta: "Começar Pro",
    popular: true,
  },
  {
    name: "Studio",
    price: "R$149",
    period: "/mês",
    desc: "Para times",
    features: ["Tudo do Pro", "5 membros", "API access", "Prioridade", "Assets exclusivos", "Suporte dedicado"],
    cta: "Contatar Vendas",
    popular: false,
  },
]

function PricingSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Escolha seu{" "}
            <span className="text-accent">plano</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Comece grátis, faça upgrade quando precisar
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl border ${
                plan.popular
                  ? "border-accent bg-card shadow-xl shadow-accent/10"
                  : "border-border bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? "bg-accent hover:bg-accent/90 text-white glow-accent"
                    : "border border-border hover:border-accent/50 bg-secondary/50 hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ───────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-accent/15 pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Floating sprites */}
        <div className="flex justify-center gap-6 mb-12">
          {SPRITES.slice(0, 4).map((sprite, i) => (
            <motion.div
              key={sprite.label}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
            >
              <PixelSprite data={sprite} pixelSize={8} />
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Comece seu próximo projeto
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg"
        >
          Pipeline profissional de pixel art para desenvolvedores indie que levam produção a sério.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-base glow-accent group"
          >
            <Sparkles className="w-5 h-5" />
            Começar Agora — Grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border hover:border-accent/50 bg-secondary/50 font-semibold text-base"
          >
            <Code2 className="w-4 h-4" />
            Ver Documentação
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Produto", links: ["Recursos", "Preços", "Changelog", "Roadmap"] },
    { title: "Recursos", links: ["Documentação", "Tutoriais", "Blog", "API"] },
    { title: "Comunidade", links: ["Discord", "Twitter", "GitHub", "Galeria"] },
    { title: "Legal", links: ["Privacidade", "Termos", "Licença"] },
  ]

  return (
    <footer className="border-t border-border py-16 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">
                Pixel<span className="text-accent">Doxa</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pipeline profissional de pixel art para desenvolvedores indie.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 PixelDoxa. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Feito com</span>
            <motion.span
              className="text-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ♥
            </motion.span>
            <span>para devs indie</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function PixelDoxaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CharacterShowcase />
        <WorkflowSection />
        <FeaturesSection />
        <ExportSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
