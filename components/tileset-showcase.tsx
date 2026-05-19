"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Grid3X3, 
  Layers, 
  Eye, 
  EyeOff, 
  Download, 
  Settings, 
  Brush,
  Square,
  Move,
  Eraser,
  ChevronRight,
  Check,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Palette,
  TreePine,
  Castle,
  Home,
  Mountain,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

// Tileset categories with the provided images
const TILESET_VIEWS = [
  {
    id: "overview",
    name: "Environment Overview",
    description: "Complete biome collection",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-aCiBECJivU9VWZPY2nbVF2XLkP7Ivk.png",
    tiles: 847,
    categories: 6,
  },
  {
    id: "editor",
    name: "Tileset Editor",
    description: "Modular asset workspace",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-gLwMrxst3hRboiJ2mLO6ZFsUtjeydQ.png",
    tiles: 512,
    categories: 4,
  },
  {
    id: "organized",
    name: "Biome Library",
    description: "Categorized tile system",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11-xiidccy0ml9mdBdDgKFjt5a3W9cE5Y.png",
    tiles: 624,
    categories: 6,
  },
]

const TILE_CATEGORIES = [
  { id: "forest", name: "Forest", icon: TreePine, color: "#22c55e", tiles: 156 },
  { id: "dungeon", name: "Dungeon", icon: Castle, color: "#6366f1", tiles: 134 },
  { id: "village", name: "Village", icon: Home, color: "#f59e0b", tiles: 189 },
  { id: "ruins", name: "Ruins", icon: Mountain, color: "#8b5cf6", tiles: 142 },
  { id: "magic", name: "Magic", icon: Sparkles, color: "#00d4ff", tiles: 98 },
]

const LAYERS = [
  { id: "ground", name: "Ground Layer", visible: true, locked: false },
  { id: "terrain", name: "Terrain", visible: true, locked: false },
  { id: "props", name: "Props & Decor", visible: true, locked: false },
  { id: "collision", name: "Collision", visible: false, locked: true },
]

const TOOLS = [
  { id: "brush", icon: Brush, name: "Brush" },
  { id: "eraser", icon: Eraser, name: "Eraser" },
  { id: "fill", icon: Square, name: "Fill" },
  { id: "select", icon: Move, name: "Select" },
]

export function TilesetShowcase() {
  const [activeView, setActiveView] = useState(0)
  const [activeCategory, setActiveCategory] = useState("forest")
  const [activeTool, setActiveTool] = useState("brush")
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [layers, setLayers] = useState(LAYERS)

  const currentView = TILESET_VIEWS[activeView]

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ))
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-6">
            <Grid3X3 className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Tileset Workflow</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Modular{" "}
            <span className="text-accent">Environment</span>{" "}
            System
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tilesets profissionais com auto-tiling, seamless joining e exportacao direta para engines
          </p>
        </motion.div>

        {/* Main Editor Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-2xl"
        >
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-4">
              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              <div className="h-4 w-px bg-border" />
              
              {/* Title */}
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">PIXE ART TILESET</span>
                <span className="text-xs text-muted-foreground">- {currentView.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg px-2 py-1">
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                <button 
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid Toggle */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                  showGrid ? "bg-accent/20 text-accent" : "bg-secondary/50 text-muted-foreground"
                )}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                Grid
              </button>

              {/* Export */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-xs font-medium hover:bg-accent/90 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Left Sidebar - Tools & Categories */}
            <div className="w-56 border-r border-border bg-secondary/20 p-3 space-y-4">
              {/* Tools */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Tools</div>
                <div className="grid grid-cols-4 gap-1">
                  {TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={cn(
                        "p-2.5 rounded-lg transition-all",
                        activeTool === tool.id
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                      title={tool.name}
                    >
                      <tool.icon className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tile Categories */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Biomes</div>
                <div className="space-y-1">
                  {TILE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left",
                        activeCategory === cat.id
                          ? "bg-accent/10 border border-accent/30"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: cat.color + "20" }}
                      >
                        <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-xs">{cat.name}</div>
                        <div className="text-[10px] text-muted-foreground">{cat.tiles} tiles</div>
                      </div>
                      {activeCategory === cat.id && (
                        <Check className="w-3.5 h-3.5 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Selector */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Views</div>
                <div className="space-y-1">
                  {TILESET_VIEWS.map((view, i) => (
                    <button
                      key={view.id}
                      onClick={() => setActiveView(i)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left",
                        activeView === i
                          ? "bg-accent/10 border border-accent/30"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded overflow-hidden bg-secondary">
                        <img 
                          src={view.image} 
                          alt={view.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">{view.name}</div>
                        <div className="text-[10px] text-muted-foreground">{view.tiles} tiles</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Viewport */}
            <div className="flex-1 relative">
              <div className="aspect-[16/10] relative overflow-hidden bg-[#1a1d23]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={currentView.image}
                      alt={currentView.name}
                      className="w-full h-full object-cover"
                      style={{ 
                        imageRendering: "pixelated",
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "center center"
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0,212,255,0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,212,255,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: "32px 32px"
                    }}
                  />
                )}

                {/* Floating UI Elements */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">AutoTile:</span>
                    <span className="font-medium text-accent">Active</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 right-4 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-muted-foreground">Tile Size:</span>
                      <span className="font-mono ml-1">32x32px</span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div>
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="text-accent ml-1">Seamless</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
                >
                  <div className="px-3 py-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border text-xs">
                    <span className="text-muted-foreground">Categories:</span>
                    <span className="font-medium ml-1">{currentView.categories}</span>
                    <span className="text-muted-foreground mx-2">|</span>
                    <span className="text-muted-foreground">Total Tiles:</span>
                    <span className="font-medium ml-1">{currentView.tiles}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-[10px] font-medium rounded">MODULAR ASSETS</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-medium rounded">SEAMLESS JOINING</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Sidebar - Layers */}
            <div className="w-52 border-l border-border bg-secondary/20 p-3 space-y-4">
              {/* Layers Panel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider px-1">Layers</div>
                  <button className="p-1 hover:bg-secondary rounded">
                    <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-1">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="p-1 hover:bg-secondary rounded"
                      >
                        {layer.visible ? (
                          <Eye className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={cn(
                        "text-xs flex-1",
                        !layer.visible && "text-muted-foreground"
                      )}>
                        {layer.name}
                      </span>
                      {layer.locked && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tile Info */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Tile Info</div>
                <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-mono">PNG 32-bit</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Grid</span>
                    <span className="font-mono">32x32 px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">AutoTile</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Collision</span>
                    <span className="text-accent">Ready</span>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">Export</div>
                <div className="space-y-1.5">
                  {["Godot (.tres)", "Unity (.asset)", "Tiled (.tsx)", "JSON + PNG"].map((format) => (
                    <button
                      key={format}
                      className="w-full flex items-center justify-between px-3 py-2 bg-secondary/30 hover:bg-secondary/50 rounded-lg text-xs transition-colors"
                    >
                      <span>{format}</span>
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">Ready</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                View: <span className="text-foreground">{currentView.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Tool: <span className="text-accent capitalize">{activeTool}</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                Biome: <span className="text-foreground capitalize">{activeCategory}</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="font-mono text-muted-foreground">Zoom: {zoom}%</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {[
            "AutoTile System",
            "Seamless Joining",
            "Collision Ready",
            "Multi-Engine Export",
            "Modular Design",
            "32x32 Grid",
          ].map((feature, i) => (
            <div
              key={feature}
              className="px-4 py-2 bg-secondary/50 rounded-full text-sm text-muted-foreground border border-border"
            >
              {feature}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
