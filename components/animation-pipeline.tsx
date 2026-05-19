"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Play, 
  Download,
  Layers,
  Grid3X3,
  ChevronRight,
  Sparkles,
  FileDown,
  Maximize2,
  Settings,
  Folder
} from "lucide-react"
import { cn } from "@/lib/utils"

// Spritesheet showcase images
const SPRITESHEET_VIEWS = {
  detailed: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-Af9EvzdaCbqbQAWxgLW8KEdiD7XLka.png",
    title: "Character Editor View",
    description: "Full spritesheet editor with character previews and frame data"
  },
  grid: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-0gQx66uNfyjlQPNPEkZD1hff3L8vk7.png",
    title: "Animation Grid View",
    description: "Organized animation rows with export controls"
  },
  horizontal: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-UdD6zHTMPNOaH8gZtalYRUXJhpKPT9.png",
    title: "Frame Breakdown View",
    description: "Detailed frame counts per animation type"
  }
}

// Character data for the detailed view
const CHARACTERS = [
  { name: "Knight", pack: "RPG Core", grid: "48x48px", animations: ["IDLE", "WALK", "ATTACK"] },
  { name: "Rogue", pack: "RPG Core", grid: "32x32px", animations: ["IDLE", "WALK", "ATTACK"] },
  { name: "Mage", pack: "RPG Core", grid: "48x48px", animations: ["IDLE", "WALK", "ATTACK"] },
  { name: "Sci-Fi Soldier", pack: "Sci-Fi Pack", grid: "32x32px", animations: ["IDLE", "WALK", "ATTACK"] },
]

// Export formats
const EXPORT_FORMATS = [
  { name: "PNG Spritesheet", ext: ".png", popular: true },
  { name: "Aseprite", ext: ".ase", popular: true },
  { name: "JSON Atlas", ext: ".json", popular: false },
  { name: "GIF Animation", ext: ".gif", popular: false },
]

export function AnimationPipeline() {
  const [activeView, setActiveView] = useState<keyof typeof SPRITESHEET_VIEWS>("detailed")
  const [selectedCharacter, setSelectedCharacter] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div 
        className="absolute inset-0 opacity-[0.015]"
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
            Workflow de{" "}
            <span className="text-accent">Producao</span>{" "}
            Profissional
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            Pipeline de animacao para desenvolvedores indie. 
            Organize, edite e exporte spritesheets game-ready.
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
              <span className="text-sm font-medium">Spritesheet Pipeline</span>
              <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">PRO</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar - Project Structure */}
            <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card/30">
              {/* View Switcher */}
              <div className="p-4 border-b border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">View Mode</div>
                <div className="space-y-1">
                  {(Object.keys(SPRITESHEET_VIEWS) as Array<keyof typeof SPRITESHEET_VIEWS>).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={cn(
                        "w-full p-2.5 rounded-lg text-left transition-all flex items-center gap-3",
                        activeView === view
                          ? "bg-accent/10 border border-accent/30"
                          : "hover:bg-secondary/50 border border-transparent"
                      )}
                    >
                      <Grid3X3 className={cn(
                        "w-4 h-4",
                        activeView === view ? "text-accent" : "text-muted-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{SPRITESHEET_VIEWS[view].title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Pack Info */}
              <div className="p-4 border-b border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Asset Pack</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                    <Folder className="w-4 h-4 text-accent" />
                    <span className="text-sm">RPG Core Pack</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-secondary/20">
                      <div className="text-muted-foreground">Characters</div>
                      <div className="font-medium">4</div>
                    </div>
                    <div className="p-2 rounded bg-secondary/20">
                      <div className="text-muted-foreground">Animations</div>
                      <div className="font-medium">12</div>
                    </div>
                    <div className="p-2 rounded bg-secondary/20">
                      <div className="text-muted-foreground">Total Frames</div>
                      <div className="font-medium">156</div>
                    </div>
                    <div className="p-2 rounded bg-secondary/20">
                      <div className="text-muted-foreground">Grid Size</div>
                      <div className="font-medium">32-48px</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character List */}
              <div className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Characters</div>
                <div className="space-y-1">
                  {CHARACTERS.map((char, i) => (
                    <button
                      key={char.name}
                      onClick={() => setSelectedCharacter(i)}
                      className={cn(
                        "w-full p-2.5 rounded-lg text-left transition-all",
                        selectedCharacter === i
                          ? "bg-accent/10 border border-accent/30"
                          : "hover:bg-secondary/50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{char.name}</span>
                        <span className="text-[10px] text-muted-foreground">{char.grid}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {char.animations.map((anim) => (
                          <span 
                            key={anim} 
                            className="text-[9px] px-1.5 py-0.5 bg-secondary/50 rounded text-muted-foreground"
                          >
                            {anim}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Main Preview */}
            <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-[600px]">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/20">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{SPRITESHEET_VIEWS[activeView].title}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{SPRITESHEET_VIEWS[activeView].description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Engine Target:</span>
                  <span className="text-xs font-medium text-accent">Godot/Unity</span>
                </div>
              </div>

              {/* Main Spritesheet Preview */}
              <div className="flex-1 relative overflow-hidden bg-[#1a1d23]">
                {/* Subtle grid pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #333 1px, transparent 1px),
                      linear-gradient(to bottom, #333 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px'
                  }}
                />

                {/* Spritesheet Image */}
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center p-4"
                >
                  <img
                    src={SPRITESHEET_VIEWS[activeView].url}
                    alt={SPRITESHEET_VIEWS[activeView].title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    style={{ imageRendering: "pixelated" }}
                  />
                </motion.div>

                {/* Floating UI Overlays */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 flex flex-col gap-2"
                >
                  <div className="px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-400">Ready to Export</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 right-4 flex flex-col gap-2"
                >
                  <div className="px-3 py-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Grid:</span>
                      <span className="font-medium">32x32px</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Timeline Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <div className="px-4 py-3 bg-card/90 backdrop-blur-sm rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="p-2 bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                          <Play className="w-4 h-4 text-accent-foreground" />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Animation Preview</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "w-6 h-1 rounded-full transition-colors",
                                  i < 3 ? "bg-accent" : "bg-border"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium">8 FPS</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Loop</span>
                        <div className="w-8 h-4 bg-accent/30 rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-accent rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Sidebar - Export Panel */}
            <div className="w-full lg:w-56 border-t lg:border-t-0 lg:border-l border-border bg-card/30 p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Export Options</div>
              
              {/* Format Selection */}
              <div className="space-y-2 mb-6">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format.name}
                    className="w-full p-2.5 rounded-lg border border-border hover:border-accent/50 transition-all flex items-center justify-between bg-secondary/20 hover:bg-secondary/40"
                  >
                    <div className="flex items-center gap-2">
                      <FileDown className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{format.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {format.popular && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-accent/20 text-accent rounded">Popular</span>
                      )}
                      <span className="text-xs text-muted-foreground">{format.ext}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Export */}
              <div className="space-y-2">
                <button className="w-full p-3 rounded-lg bg-accent text-accent-foreground font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Spritesheet
                </button>
                <button className="w-full p-2.5 rounded-lg border border-border hover:border-accent/50 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Generate Variations
                </button>
              </div>

              {/* Export Stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Export Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Characters</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Frames</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Size</span>
                    <span className="font-medium">~2.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features below the editor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Characters", value: "4", sublabel: "in pack" },
            { label: "Animations", value: "12", sublabel: "total" },
            { label: "Frames", value: "156", sublabel: "generated" },
            { label: "Export", value: "4", sublabel: "formats" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-4 rounded-xl bg-card/50 border border-border text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground/60">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
