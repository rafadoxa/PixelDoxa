"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight, Sparkles, Layers, Map, Download } from "lucide-react"
import { cn } from "@/lib/utils"

// Video/Demo data representing the 4 core workflows
const DEMO_VIDEOS = [
  {
    id: "sprite-generation",
    title: "Sprite Generation",
    subtitle: "Do prompt ao pixel",
    description: "Descreva seu personagem e veja a IA criar sprites detalhados em segundos",
    icon: Sparkles,
    color: "#00d4ff",
    gradient: "from-cyan-500/20 to-blue-500/20",
    // Simulated video frames using tileset image cropped areas
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-CsuGRMdjgj0c2qo0pC8A6GhYZ3wvwt.png",
    duration: "0:45",
    features: ["Prompts em linguagem natural", "Multiplos estilos", "Variações instantaneas"]
  },
  {
    id: "animation-workflow",
    title: "Animation Pipeline",
    subtitle: "Spritesheets completos",
    description: "Crie ciclos de animacao profissionais: idle, walk, attack, hurt e mais",
    icon: Layers,
    color: "#a855f7",
    gradient: "from-purple-500/20 to-pink-500/20",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-i3jLlgkcUa7CEkye7AcwXp0q4wAfQm.png",
    duration: "1:12",
    features: ["6+ estados de animacao", "Timeline editor", "Onion skinning"]
  },
  {
    id: "procedural-maps",
    title: "World Generation",
    subtitle: "Mapas procedurais",
    description: "Gere mundos unicos com biomas, dungeons e vilas usando algoritmos avancados",
    icon: Map,
    color: "#22c55e",
    gradient: "from-green-500/20 to-emerald-500/20",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/debug%20visuals.%20Avoid%20random%20meaningless%20terrain.%20The%20world%20should%20feel%20alive%20and%20professionally%20desi-KWA5UDkd3UGoTzxCx3bBaxpea0LTFv.png",
    duration: "0:58",
    features: ["Wave Function Collapse", "Auto-tiling", "Biome blending"]
  },
  {
    id: "export-pipeline",
    title: "Export Pipeline",
    subtitle: "Game-ready output",
    description: "Exporte diretamente para Godot, Unity, GameMaker com formatos nativos",
    icon: Download,
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-orange-500/20",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_vsoxa5vsoxa5vsox-02DlWAoOQoq5K1136inqxavqyB0ie6.png",
    duration: "0:32",
    features: ["PNG, GIF, Aseprite", "Sprite atlas packing", "Metadata JSON"]
  }
]

// Animated typing effect for demo
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true)
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Simulated video player with animated content
function VideoPlayer({ demo, isPlaying }: { demo: typeof DEMO_VIDEOS[0]; isPlaying: boolean }) {
  const [progress, setProgress] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0)
      setShowPrompt(false)
      return
    }
    
    // Show prompt after 500ms
    const promptTimeout = setTimeout(() => setShowPrompt(true), 500)
    
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          return 0
        }
        return p + 0.5
      })
    }, 50)
    
    return () => {
      clearInterval(interval)
      clearTimeout(promptTimeout)
    }
  }, [isPlaying])

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-background/80 border border-border/50">
      {/* Video content area */}
      <div className="absolute inset-0">
        {/* Background image */}
        <motion.img
          src={demo.thumbnail}
          alt={demo.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: "auto" }}
          initial={{ scale: 1.1, opacity: 0.3 }}
          animate={{ 
            scale: isPlaying ? 1 : 1.1,
            opacity: isPlaying ? 1 : 0.5
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Overlay gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t",
          demo.gradient,
          "opacity-60"
        )} />
        
        {/* Scanlines effect */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />
        
        {/* Animated UI overlay when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              {/* Simulated prompt input */}
              {demo.id === "sprite-generation" && showPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-20 left-4 right-4 md:left-8 md:right-8"
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-xl p-4 border border-accent/30 shadow-2xl">
                    <div className="text-xs text-muted-foreground mb-2">AI Prompt</div>
                    <div className="text-sm md:text-base text-foreground font-mono">
                      <TypewriterText 
                        text="Guerreiro medieval com armadura dourada, capa vermelha, espada brilhante, estilo dark fantasy, 64x64 pixels"
                        delay={200}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Animation timeline for animation workflow */}
              {demo.id === "animation-workflow" && showPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-20 left-4 right-4"
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-xl p-3 border border-purple-500/30 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xs text-purple-400">Timeline</div>
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-500"
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {["IDLE", "WALK", "ATTACK", "DASH", "HURT", "DEATH"].map((state, i) => (
                        <motion.div
                          key={state}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={cn(
                            "px-2 py-1 text-[10px] rounded font-medium",
                            i === Math.floor((progress / 100) * 6) % 6
                              ? "bg-purple-500 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {state}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Map generation progress */}
              {demo.id === "procedural-maps" && showPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-20 left-4 right-4"
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-xl p-3 border border-green-500/30 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-green-400">Generating World...</div>
                      <div className="text-xs text-muted-foreground">{Math.floor(progress)}%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                      <span>Terrain</span>
                      <span>Biomes</span>
                      <span>Rivers</span>
                      <span>POIs</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Export progress */}
              {demo.id === "export-pipeline" && showPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-20 left-4 right-4"
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-xl p-3 border border-amber-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#478CBF] flex items-center justify-center">
                        <img 
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%282%29-30PylI6AGRnBdknSVIDtQmVszEE8aR.jpeg"
                          alt="Godot"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-amber-400">Exporting to Godot 4.x</div>
                        <div className="text-[10px] text-muted-foreground">character_spritesheet.tres</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {["Sprites packed", "Animations exported", "Metadata generated"].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: progress > (i + 1) * 30 ? 1 : 0.3,
                            x: 0
                          }}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full flex items-center justify-center",
                            progress > (i + 1) * 30 ? "bg-green-500" : "bg-muted"
                          )}>
                            {progress > (i + 1) * 30 && (
                              <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className={progress > (i + 1) * 30 ? "text-foreground" : "text-muted-foreground"}>
                            {step}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Playing indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 left-4 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/80 font-medium">LIVE DEMO</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Play button overlay when paused */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
        <motion.div
          className="h-full"
          style={{ 
            background: `linear-gradient(90deg, ${demo.color}, ${demo.color}80)`,
            width: `${progress}%`
          }}
        />
      </div>
    </div>
  )
}

export function VideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  
  const activeDemo = DEMO_VIDEOS[activeIndex]
  
  // Auto-advance demos
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setActiveIndex(i => (i + 1) % DEMO_VIDEOS.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [isPlaying])
  
  const goToPrev = () => setActiveIndex(i => (i - 1 + DEMO_VIDEOS.length) % DEMO_VIDEOS.length)
  const goToNext = () => setActiveIndex(i => (i + 1) % DEMO_VIDEOS.length)

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(180 80% 45%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(180 80% 45%) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/20">
            <Play className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Veja em Acao</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pipeline{" "}
            <span className="text-accent">Profissional</span>{" "}
            em Acao
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe o workflow completo de criacao de assets pixel art em tempo real
          </p>
        </motion.div>
        
        {/* Main video area */}
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Video player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <VideoPlayer demo={activeDemo} isPlaying={isPlaying} />
            
            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={goToPrev}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-4">
              {DEMO_VIDEOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeIndex 
                      ? "w-8 bg-accent" 
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Sidebar - Demo list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="text-sm text-muted-foreground mb-4">Workflows Disponiveis</div>
            
            {DEMO_VIDEOS.map((demo, i) => (
              <motion.button
                key={demo.id}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "w-full p-4 rounded-xl border text-left transition-all group",
                  i === activeIndex
                    ? "bg-card border-accent/50 shadow-lg shadow-accent/5"
                    : "bg-card/50 border-border hover:border-accent/30 hover:bg-card"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      i === activeIndex ? "bg-accent/20" : "bg-muted"
                    )}
                    style={{ color: demo.color }}
                  >
                    <demo.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{demo.title}</span>
                      <span className="text-xs text-muted-foreground">{demo.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {demo.subtitle}
                    </p>
                    
                    {/* Progress indicator for active */}
                    {i === activeIndex && isPlaying && (
                      <motion.div
                        className="mt-2 h-0.5 bg-muted rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: demo.color }}
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 8, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Features on hover/active */}
                <AnimatePresence>
                  {i === activeIndex && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-border/50"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {demo.features.map((feature, fi) => (
                          <span
                            key={fi}
                            className="px-2 py-0.5 bg-muted rounded text-[10px] text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
