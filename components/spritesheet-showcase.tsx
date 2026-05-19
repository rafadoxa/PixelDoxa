"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  ZoomIn,
  ZoomOut,
  Download,
  Layers,
  Grid3X3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Settings,
  Eye,
  Clock,
  Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Professional spritesheet data
const SPRITESHEETS = [
  {
    id: "cyber-knight",
    name: "Cyber Knight",
    subtitle: "Futuristic Warrior Pack",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-JeOGqyvtWGJwkyBYlUgfG26PRbwgaU.png",
    animations: [
      { name: "IDLE STANCE", frames: 4, fps: 8 },
      { name: "WALK CYCLE", frames: 6, fps: 12 },
      { name: "ATTACK SEQUENCE", frames: 5, fps: 15 },
      { name: "DASH MOVEMENT", frames: 4, fps: 20 },
      { name: "HURT REACTION", frames: 3, fps: 10 },
    ],
    resolution: "64x64",
    totalFrames: 22,
    style: "Sci-Fi",
  },
  {
    id: "shadow-warrior",
    name: "Shadow Warrior",
    subtitle: "Dark Fantasy Character",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-p8zsWMqUr32M37T7QtGq85G52kuvcj.png",
    animations: [
      { name: "IDLE", frames: 6, fps: 8 },
      { name: "WALK", frames: 11, fps: 12 },
      { name: "ATTACK", frames: 8, fps: 15 },
      { name: "DASH", frames: 4, fps: 20 },
      { name: "HURT", frames: 6, fps: 10 },
    ],
    resolution: "48x48",
    totalFrames: 35,
    style: "Dark Fantasy",
  },
  {
    id: "iron-guardian",
    name: "Iron Guardian",
    subtitle: "Heavy Armored Knight",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-ZZL8NQ2jAI3FI0YReTBS7SPtaX0pWT.png",
    animations: [
      { name: "IDLE", frames: 7, fps: 8 },
      { name: "WALK", frames: 8, fps: 10 },
      { name: "ATTACK", frames: 9, fps: 15 },
      { name: "DASH", frames: 5, fps: 18 },
      { name: "HURT", frames: 4, fps: 12 },
    ],
    resolution: "64x64",
    totalFrames: 33,
    style: "Medieval",
  },
]

export function SpritesheetShowcase() {
  const [selectedSheet, setSelectedSheet] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [selectedAnimation, setSelectedAnimation] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [loopEnabled, setLoopEnabled] = useState(true)

  const sheet = SPRITESHEETS[selectedSheet]
  const animation = sheet.animations[selectedAnimation]

  // Simulate frame animation
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= animation.frames - 1) {
          return loopEnabled ? 0 : prev
        }
        return prev + 1
      })
    }, 1000 / animation.fps)
    return () => clearInterval(interval)
  }, [isPlaying, animation.frames, animation.fps, loopEnabled])

  // Reset frame when changing animation
  useEffect(() => {
    setCurrentFrame(0)
  }, [selectedAnimation, selectedSheet])

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Layers className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Production Pipeline</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            SpriteSheet{" "}
            <span className="text-accent">Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional animation assets ready for production. Full sprite sequences with frame data, timing, and export-ready organization.
          </p>
        </motion.div>

        {/* Main Production Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden"
        >
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border">
            <div className="flex items-center gap-4">
              {/* Asset Selector */}
              <div className="flex items-center gap-2">
                {SPRITESHEETS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSheet(i)
                      setSelectedAnimation(0)
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      selectedSheet === i
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded-lg">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
                <button 
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Toggle */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showGrid ? "bg-accent/20 text-accent" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              {/* Settings */}
              <button className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Left Panel - Animation List */}
            <div className="w-64 border-r border-border bg-secondary/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Animations</h3>
                <span className="text-xs text-muted-foreground">{sheet.animations.length} clips</span>
              </div>

              <div className="space-y-2">
                {sheet.animations.map((anim, i) => (
                  <motion.button
                    key={anim.name}
                    onClick={() => setSelectedAnimation(i)}
                    className={cn(
                      "w-full p-3 rounded-xl text-left transition-all",
                      selectedAnimation === i
                        ? "bg-accent/15 border border-accent/30"
                        : "bg-card/50 border border-transparent hover:border-border"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{anim.name}</span>
                      {selectedAnimation === i && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-accent rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{anim.frames} frames</span>
                      <span>{anim.fps} fps</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Asset Info */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Asset Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="font-mono">{sheet.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Frames</span>
                    <span className="font-mono">{sheet.totalFrames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style</span>
                    <span>{sheet.style}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Spritesheet Preview */}
            <div className="flex-1 p-6">
              {/* Preview Area */}
              <div className="relative bg-[#1a1a2e] rounded-xl overflow-hidden border border-border/50">
                {/* Frame Info Overlay */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <span className="text-xs font-mono text-accent">
                      Frame {currentFrame + 1}/{animation.frames}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-mono">{animation.fps} FPS</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 z-20">
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg border flex items-center gap-2",
                    isPlaying 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-yellow-500/10 border-yellow-500/30"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isPlaying ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                    )} />
                    <span className="text-xs font-medium">
                      {isPlaying ? "Playing" : "Paused"}
                    </span>
                  </div>
                </div>

                {/* Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 z-10 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,212,255,0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,212,255,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px",
                    }}
                  />
                )}

                {/* Main Spritesheet Image */}
                <div 
                  className="relative overflow-auto"
                  style={{ maxHeight: "500px" }}
                >
                  <motion.div
                    className="relative"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <img
                      src={sheet.image}
                      alt={sheet.name}
                      className="w-full h-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </motion.div>
                </div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1a1a2e] to-transparent pointer-events-none" />
              </div>

              {/* Timeline Controls */}
              <div className="mt-4 bg-secondary/30 rounded-xl p-4 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentFrame(0)}
                      className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-accent rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-accent-foreground" />
                      ) : (
                        <Play className="w-4 h-4 text-accent-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => setCurrentFrame(animation.frames - 1)}
                      className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setLoopEnabled(!loopEnabled)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        loopEnabled 
                          ? "bg-accent/20 text-accent" 
                          : "bg-secondary/50 text-muted-foreground"
                      )}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Loop
                    </button>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="relative">
                  <div className="h-8 bg-secondary/50 rounded-lg overflow-hidden flex">
                    {Array.from({ length: animation.frames }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentFrame(i)
                          setIsPlaying(false)
                        }}
                        className={cn(
                          "flex-1 border-r border-border/30 last:border-r-0 transition-all relative group",
                          currentFrame === i 
                            ? "bg-accent" 
                            : "bg-transparent hover:bg-accent/20"
                        )}
                      >
                        <span className={cn(
                          "absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono",
                          currentFrame === i ? "text-accent-foreground" : "text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Export */}
            <div className="w-56 border-l border-border bg-secondary/20 p-4">
              <h3 className="text-sm font-semibold mb-4">Export Options</h3>

              <div className="space-y-3">
                {[
                  { format: "PNG Sequence", ext: ".png", size: "2.4 MB" },
                  { format: "Spritesheet", ext: ".png", size: "890 KB" },
                  { format: "Aseprite", ext: ".ase", size: "1.2 MB" },
                  { format: "JSON + PNG", ext: ".json", size: "920 KB" },
                ].map((option) => (
                  <button
                    key={option.format}
                    className="w-full p-3 bg-card/50 border border-border rounded-xl text-left hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{option.format}</span>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{option.ext}</span>
                      <span>•</span>
                      <span>{option.size}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <Eye className="w-4 h-4" />
                    Preview All Frames
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 bg-secondary/50 rounded-lg text-sm hover:bg-secondary transition-colors">
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen View
                  </button>
                </div>
              </div>

              {/* Export All Button */}
              <motion.button
                className="w-full mt-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                Export All
              </motion.button>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-t border-border text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Asset: <span className="text-foreground font-medium">{sheet.name}</span></span>
              <span>•</span>
              <span>Animation: <span className="text-foreground font-medium">{animation.name}</span></span>
              <span>•</span>
              <span className="font-mono">{sheet.resolution}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Export Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Asset Cards Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {SPRITESHEETS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => {
                setSelectedSheet(i)
                setSelectedAnimation(0)
              }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                selectedSheet === i
                  ? "bg-accent/10 border-accent/30"
                  : "bg-card/30 border-border hover:border-accent/20"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{s.name}</h4>
                  <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                </div>
                {selectedSheet === i && (
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{s.animations.length} animations</span>
                <span>{s.totalFrames} frames</span>
                <span className="font-mono">{s.resolution}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
