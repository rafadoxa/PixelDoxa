"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  Maximize2, 
  Settings, 
  Layers, 
  Eye,
  Monitor,
  Gamepad2,
  Zap,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Grid3X3,
  Map,
  Heart,
  Shield,
  Sword
} from "lucide-react"
import { Button } from "@/components/ui/button"

const GAMEPLAY_SCENES = [
  {
    id: "battle",
    name: "Dungeon Assault",
    description: "Party vs Goblins - Real-time combat demo",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/16-Suugo58smeUXZPPHUyud3feOK9yhXp.png",
    stats: { fps: 60, entities: 24, particles: 128 },
    scene: "dungeon_entrance_01"
  },
  {
    id: "exploration", 
    name: "Forest Clearing",
    description: "Exploration gameplay with party system",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17-5NarLsMe7qr0WzuOXKmanadlRZNC9r.png",
    stats: { fps: 60, entities: 18, particles: 64 },
    scene: "forest_clearing_02"
  }
]

export function GameplayShowcase() {
  const [activeScene, setActiveScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  
  const scene = GAMEPLAY_SCENES[activeScene]

  const nextScene = () => setActiveScene((prev) => (prev + 1) % GAMEPLAY_SCENES.length)
  const prevScene = () => setActiveScene((prev) => (prev - 1 + GAMEPLAY_SCENES.length) % GAMEPLAY_SCENES.length)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-6">
            <Gamepad2 className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Gameplay Preview</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Assets em{" "}
            <span className="text-accent">Acao</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja como os assets do PixelDoxa funcionam em um ambiente de jogo real. 
            Pronto para producao em Godot, Unity e GameMaker.
          </p>
        </motion.div>

        {/* Main Viewport */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Engine Window Frame */}
          <div className="rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="h-4 w-px bg-border/50" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>PixelDoxa Engine Preview</span>
                  <span className="text-accent">—</span>
                  <span className="text-foreground">{scene.scene}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded text-xs text-green-400">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Preview
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Viewport Content */}
            <div className="relative aspect-video bg-black">
              {/* Scene Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <img
                    src={scene.image}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                  }}
                />
              )}

              {/* Top Left - Scene Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span className="text-white/90 font-medium">{scene.name}</span>
                </div>
                <p className="text-[10px] text-white/50 mt-0.5">{scene.description}</p>
              </motion.div>

              {/* Top Right - Performance Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-4 right-4 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span className="text-white/90">{scene.stats.fps} FPS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-blue-400" />
                    <span className="text-white/90">{scene.stats.entities} Entities</span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Left - Mini Party UI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 flex gap-2"
              >
                {[
                  { name: "Knight", hp: 85, color: "#478CBF" },
                  { name: "Rogue", hp: 72, color: "#8BC34A" },
                  { name: "Mage", hp: 60, color: "#9C27B0" },
                ].map((char, i) => (
                  <div 
                    key={char.name}
                    className="px-2 py-1.5 bg-black/80 backdrop-blur-sm rounded border border-white/10"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: char.color }}
                      />
                      <span className="text-[10px] text-white/80">{char.name}</span>
                    </div>
                    <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${char.hp}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Bottom Right - Minimap */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 right-4 w-24 h-24 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-60">
                  <img
                    src={scene.image}
                    alt="Minimap"
                    className="w-full h-full object-cover blur-[1px]"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50" />
                </div>
                <div className="absolute top-1 left-1 flex items-center gap-1 text-[8px] text-white/60">
                  <Map className="w-2.5 h-2.5" />
                  MAP
                </div>
              </motion.div>

              {/* Scene Navigation Arrows */}
              <button
                onClick={prevScene}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-70"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextScene}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-70"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
            </div>

            {/* Bottom Control Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-card/80 border-t border-border/50">
              {/* Left Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span className="text-xs">Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span className="text-xs">Reproduzir</span>
                    </>
                  )}
                </Button>
                <div className="h-4 w-px bg-border/50" />
                <Button 
                  variant={showGrid ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  className="h-8 gap-2"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span className="text-xs">Grid</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-xs">Layers</span>
                </Button>
              </div>

              {/* Center - Scene Selector */}
              <div className="flex items-center gap-2">
                {GAMEPLAY_SCENES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScene(i)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                      i === activeScene
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Right Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio On</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>1920x1080</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 rounded border border-accent/20">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%282%29-30PylI6AGRnBdknSVIDtQmVszEE8aR.jpeg"
                    alt="Godot"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-accent">Godot 4.x Ready</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {[
            { icon: Sword, label: "Combat System Ready" },
            { icon: Heart, label: "Health/Status UI" },
            { icon: Map, label: "Tilemap Compatible" },
            { icon: Layers, label: "Multi-Layer Support" },
            { icon: Shield, label: "Character Colliders" },
            { icon: Zap, label: "Particle Effects" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 text-sm text-muted-foreground"
            >
              <feature.icon className="w-4 h-4 text-accent" />
              {feature.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
