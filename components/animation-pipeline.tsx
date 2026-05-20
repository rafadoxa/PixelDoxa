"use client"
import { useLanguage } from "@/lib/language-context"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Layers, 
  RefreshCw,
  Upload,
  Download,
  Sparkles,
  Check,
  ChevronRight,
  Zap,
  Target,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Plus,
  Settings,
  Grid3X3
} from "lucide-react"
import { cn } from "@/lib/utils"

// Animation types with frame data
const ANIMATION_TYPES = [
  { id: "idle", name: "Idle", frames: 8, fps: 8, color: "#22c55e" },
  { id: "walk", name: "Walk", frames: 8, fps: 12, color: "#3b82f6" },
  { id: "attack", name: "Attack", frames: 10, fps: 15, color: "#ef4444" },
  { id: "dash", name: "Dash", frames: 6, fps: 20, color: "#8b5cf6" },
  { id: "hurt", name: "Hurt", frames: 4, fps: 10, color: "#f59e0b" },
  { id: "death", name: "Death", frames: 10, fps: 8, color: "#6b7280" },
]

// Timeline layers
const LAYERS = [
  { id: "body", name: "Body", visible: true, locked: false },
  { id: "cloak", name: "Cloak", visible: true, locked: false },
  { id: "weapon", name: "Weapon", visible: true, locked: false },
  { id: "vfx", name: "VFX", visible: true, locked: false },
]

// Features to highlight
const PIPELINE_FEATURES = [
  {
    icon: Sparkles,
    title: "Text-to-Animation",
    description: "Descreva a animacao e gere frames consistentes automaticamente"
  },
  {
    icon: Target,
    title: "Character Coherence",
    description: "Mantenha consistencia visual entre todos os frames gerados"
  },
  {
    icon: RefreshCw,
    title: "Regenerate Frames",
    description: "Regenere frames individuais sem afetar o resto da animacao"
  },
  {
    icon: Upload,
    title: "Upload Concepts",
    description: "Importe seus proprios designs e gere animacoes a partir deles"
  },
  {
    icon: Grid3X3,
    title: "Spritesheet Export",
    description: "Exporte spritesheets otimizados para qualquer game engine"
  },
  {
    icon: Layers,
    title: "Layer System",
    description: "Edite camadas separadas: corpo, roupa, armas, efeitos"
  },
]

export function AnimationPipeline() {
  const { t } = useLanguage()
  const [selectedAnimation, setSelectedAnimation] = useState(ANIMATION_TYPES[2]) // Attack
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedFrames, setSelectedFrames] = useState<number[]>([])
  const [layers, setLayers] = useState(LAYERS)
  const [zoom, setZoom] = useState(100)

  // Animation playback
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % selectedAnimation.frames)
    }, 1000 / selectedAnimation.fps)
    return () => clearInterval(interval)
  }, [isPlaying, selectedAnimation])

  const toggleLayer = (layerId: string, property: 'visible' | 'locked') => {
    setLayers(layers.map(l => 
      l.id === layerId ? { ...l, [property]: !l[property] } : l
    ))
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Layers className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Animation Pipeline</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Animation{" "}
            <span className="text-accent">{t.animationPipeline.badge}</span>{" "}
            Workflow
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            {t.animationPipeline.subtitle}
          </p>
        </motion.div>

        {/* Main Editor Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20"
        >
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-medium">Animation Editor</span>
              <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">PRO</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Animation Types */}
            <div className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-border p-4 bg-card/30">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Animations</div>
              <div className="space-y-1">
                {ANIMATION_TYPES.map((anim) => (
                  <button
                    key={anim.id}
                    onClick={() => {
                      setSelectedAnimation(anim)
                      setCurrentFrame(0)
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all flex items-center gap-3",
                      selectedAnimation.id === anim.id
                        ? "bg-accent/10 border border-accent/30"
                        : "hover:bg-secondary/50 border border-transparent"
                    )}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: anim.color }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{anim.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {anim.frames} frames @ {anim.fps}fps
                      </div>
                    </div>
                    {selectedAnimation.id === anim.id && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                  </button>
                ))}
              </div>

              {/* Add Animation Button */}
              <button className="w-full mt-3 p-3 rounded-lg border border-dashed border-border hover:border-accent/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
                Add Animation
              </button>
            </div>

            {/* Center - Preview & Timeline */}
            <div className="flex-1 flex flex-col">
              {/* Preview Area */}
              <div className="flex-1 p-6 flex items-center justify-center min-h-[300px] lg:min-h-[400px] relative">
                {/* Checkerboard background */}
                <div 
                  className="absolute inset-6 rounded-xl opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #333 25%, transparent 25%),
                      linear-gradient(-45deg, #333 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #333 75%),
                      linear-gradient(-45deg, transparent 75%, #333 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />

                {/* Sprite Preview */}
                <motion.div
                  key={`${selectedAnimation.id}-${currentFrame}`}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10"
                >
                  <div 
                    className="relative overflow-hidden rounded-lg"
                    style={{ 
                      width: `${zoom * 1.5}px`, 
                      height: `${zoom * 1.5}px`,
                    }}
                  >
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-i3jLlgkcUa7CEkye7AcwXp0q4wAfQm.png"
                      alt="Animation Preview"
                      className="w-full h-full object-cover"
                      style={{ 
                        imageRendering: "pixelated",
                        objectPosition: `${-currentFrame * 12.5}% ${selectedAnimation.id === 'idle' ? '0%' : selectedAnimation.id === 'walk' ? '16.6%' : selectedAnimation.id === 'attack' ? '33.3%' : selectedAnimation.id === 'dash' ? '50%' : selectedAnimation.id === 'hurt' ? '66.6%' : '83.3%'}`
                      }}
                    />
                  </div>
                  
                  {/* Frame indicator */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-card rounded-full border border-border text-xs">
                    Frame {currentFrame + 1} / {selectedAnimation.frames}
                  </div>
                </motion.div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-border">
                  <button 
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-1.5 hover:bg-secondary rounded transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs w-12 text-center">{zoom}%</span>
                  <button 
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-1.5 hover:bg-secondary rounded transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-border bg-card/50 p-4">
                {/* Playback controls */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentFrame(0)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setCurrentFrame(selectedAnimation.frames - 1)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="h-4 w-px bg-border" />
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">FPS:</span>
                    <span className="font-medium">{selectedAnimation.fps}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {((selectedAnimation.frames / selectedAnimation.fps) * 1000).toFixed(0)}ms
                    </span>
                  </div>

                  <div className="flex-1" />

                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Timeline frames */}
                <div className="relative">
                  {/* Frame ruler */}
                  <div className="flex mb-2">
                    {Array.from({ length: selectedAnimation.frames }).map((_, i) => (
                      <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  {/* Frame thumbnails */}
                  <div className="flex gap-1">
                    {Array.from({ length: selectedAnimation.frames }).map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setCurrentFrame(i)
                          setIsPlaying(false)
                        }}
                        className={cn(
                          "flex-1 aspect-square rounded-lg border-2 transition-all relative overflow-hidden",
                          currentFrame === i
                            ? "border-accent ring-2 ring-accent/30"
                            : selectedFrames.includes(i)
                            ? "border-accent/50"
                            : "border-border hover:border-muted-foreground"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div 
                          className="w-full h-full"
                          style={{ 
                            backgroundColor: `${selectedAnimation.color}20`,
                          }}
                        />
                        {currentFrame === i && (
                          <motion.div
                            layoutId="frameIndicator"
                            className="absolute inset-0 border-2 border-accent rounded-lg"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Playhead */}
                  <motion.div
                    className="absolute top-0 w-0.5 h-full bg-accent pointer-events-none"
                    style={{
                      left: `${(currentFrame / selectedAnimation.frames) * 100}%`,
                    }}
                    animate={{
                      left: `${(currentFrame / selectedAnimation.frames) * 100}%`,
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Layers */}
            <div className="w-full lg:w-56 border-t lg:border-t-0 lg:border-l border-border p-4 bg-card/30">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Layers</div>
              <div className="space-y-1">
                {layers.map((layer, i) => (
                  <div
                    key={layer.id}
                    className="p-2 rounded-lg bg-secondary/30 flex items-center gap-2"
                  >
                    <button 
                      onClick={() => toggleLayer(layer.id, 'visible')}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    <button 
                      onClick={() => toggleLayer(layer.id, 'locked')}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      {layer.locked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-accent" />
                      )}
                    </button>
                    <span className="text-sm flex-1">{layer.name}</span>
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ 
                        backgroundColor: ['#ef4444', '#3b82f6', '#8b5cf6', '#22c55e'][i] 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</div>
                <div className="space-y-2">
                  <button className="w-full p-2 rounded-lg bg-accent/10 border border-accent/30 text-sm flex items-center gap-2 hover:bg-accent/20 transition-colors">
                    <RefreshCw className="w-4 h-4 text-accent" />
                    Regenerate Frame
                  </button>
                  <button className="w-full p-2 rounded-lg bg-secondary/50 border border-border text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Reference
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PIPELINE_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-5 rounded-xl bg-card/50 border border-border hover:border-accent/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Spritesheet Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Spritesheet Export</h3>
            <p className="text-muted-foreground">Exporte animacoes completas em formato otimizado para sua engine</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spritesheet 1 */}
            <div className="rounded-xl border border-border overflow-hidden bg-card/50">
              <div className="p-3 border-b border-border bg-card/80 flex items-center justify-between">
                <span className="text-sm font-medium">arcane_knight_spritesheet.png</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>1024x768</span>
                  <span>64 frames</span>
                </div>
              </div>
              <div className="p-4">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-i3jLlgkcUa7CEkye7AcwXp0q4wAfQm.png"
                  alt="Arcane Knight Spritesheet"
                  className="w-full h-auto rounded-lg"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            {/* Spritesheet 2 */}
            <div className="rounded-xl border border-border overflow-hidden bg-card/50">
              <div className="p-3 border-b border-border bg-card/80 flex items-center justify-between">
                <span className="text-sm font-medium">royal_vanguard_spritesheet.png</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>1024x768</span>
                  <span>56 frames</span>
                </div>
              </div>
              <div className="p-4">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-CsuGRMdjgj0c2qo0pC8A6GhYZ3wvwt.png"
                  alt="Royal Vanguard Spritesheet"
                  className="w-full h-auto rounded-lg"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
