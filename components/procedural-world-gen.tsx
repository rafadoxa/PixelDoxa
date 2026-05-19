"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Globe2, 
  Layers, 
  Mountain, 
  Trees, 
  Waves, 
  Map, 
  Castle,
  Sparkles,
  RefreshCw,
  Download,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Eye,
  EyeOff,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Maximize2,
  RotateCcw,
  Compass,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

// World map data
const WORLD_MAPS = [
  {
    id: "aethelgard",
    name: "Aethelgard",
    subtitle: "Epic Fantasy Continent",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13-WwOFEGn3J19h2c27eTXIBHCcroMIsz.png",
    seed: "AE-7842-GARD",
    dimensions: "4096 x 2560",
    biomes: 12,
    regions: 18,
    landmarks: 24,
    generationTime: "2.4s"
  },
  {
    id: "skyshards",
    name: "The Sky Shards",
    subtitle: "Floating Islands Realm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-YB11UQFmdfqZUzjbQXYGlgydHkFZ72.png",
    seed: "SK-9156-SHRD",
    dimensions: "4096 x 2304",
    biomes: 8,
    regions: 14,
    landmarks: 19,
    generationTime: "1.8s"
  },
  {
    id: "emerald",
    name: "Emerald Reaches",
    subtitle: "Mystical Lake Kingdom",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-MoLXHI6wXBSLUBdGB5X4gHsJckLENS.png",
    seed: "EM-3847-RECH",
    dimensions: "4096 x 2560",
    biomes: 10,
    regions: 16,
    landmarks: 22,
    generationTime: "2.1s"
  }
]

const BIOME_LAYERS = [
  { id: "terrain", name: "Terrain Base", color: "#4a5568", active: true },
  { id: "forest", name: "Forest Coverage", color: "#22c55e", active: true },
  { id: "water", name: "Water Bodies", color: "#0ea5e9", active: true },
  { id: "mountains", name: "Mountain Ranges", color: "#78716c", active: true },
  { id: "settlements", name: "Settlements", color: "#f59e0b", active: true },
  { id: "roads", name: "Road Network", color: "#a1a1aa", active: true },
  { id: "magic", name: "Magic Zones", color: "#00d4ff", active: true },
]

const ALGORITHMS = [
  { name: "Wave Function Collapse", status: "active" },
  { name: "Perlin Noise Terrain", status: "complete" },
  { name: "Voronoi Biomes", status: "complete" },
  { name: "A* Pathfinding", status: "complete" },
]

export function ProceduralWorldGen() {
  const [selectedMap, setSelectedMap] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [layers, setLayers] = useState(BIOME_LAYERS)
  const [showMinimap, setShowMinimap] = useState(true)

  const currentMap = WORLD_MAPS[selectedMap]

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l))
  }

  const handleRegenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setSelectedMap((prev) => (prev + 1) % WORLD_MAPS.length)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <Globe2 className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">World Builder</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Procedural{" "}
            <span className="text-accent">World Generation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gere mundos completos com biomas, vilas, dungeons e landmarks. 
            Wave Function Collapse e algoritmos procedurais avancados.
          </p>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-2xl"
        >
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-accent" />
                <span className="font-semibold">World Generator</span>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-accent/10 rounded">v2.4</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                {WORLD_MAPS.map((map, i) => (
                  <button
                    key={map.id}
                    onClick={() => setSelectedMap(i)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-lg transition-all",
                      selectedMap === i 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {map.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Left Panel - Generation Controls */}
            <div className="w-72 border-r border-border bg-card/30 p-4 space-y-6">
              {/* World Seed */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                  World Seed
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMap.seed}
                    readOnly
                    className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm font-mono"
                  />
                  <button 
                    onClick={handleRegenerate}
                    className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors"
                  >
                    <RefreshCw className={cn("w-4 h-4 text-accent", isGenerating && "animate-spin")} />
                  </button>
                </div>
              </div>

              {/* Biome Distribution */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Biome Distribution
                </label>
                <div className="space-y-2">
                  {[
                    { name: "Forest", percent: 35, color: "#22c55e" },
                    { name: "Mountains", percent: 20, color: "#78716c" },
                    { name: "Plains", percent: 25, color: "#84cc16" },
                    { name: "Water", percent: 15, color: "#0ea5e9" },
                    { name: "Magic", percent: 5, color: "#00d4ff" },
                  ].map((biome) => (
                    <div key={biome.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: biome.color }}
                      />
                      <span className="text-xs flex-1">{biome.name}</span>
                      <span className="text-xs text-muted-foreground">{biome.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terrain Layers */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Terrain Layers
                </label>
                <div className="space-y-1">
                  {layers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all",
                        layer.active 
                          ? "bg-secondary/50" 
                          : "bg-transparent opacity-50"
                      )}
                    >
                      <div 
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="flex-1 text-left">{layer.name}</span>
                      {layer.active ? (
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithms */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Active Algorithms
                </label>
                <div className="space-y-2">
                  {ALGORITHMS.map((algo) => (
                    <div 
                      key={algo.name}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        algo.status === "active" ? "bg-accent animate-pulse" : "bg-green-500"
                      )} />
                      <span className="text-xs">{algo.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className={cn(
                  "w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all",
                  isGenerating 
                    ? "bg-accent/50 cursor-not-allowed" 
                    : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating World...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate New World
                  </>
                )}
              </button>
            </div>

            {/* Main Viewport */}
            <div className="flex-1 relative">
              {/* Viewport Controls */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-1">
                  <button 
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 min-w-[50px] text-center">{zoom}%</span>
                  <button 
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "p-2 rounded-lg border transition-colors",
                    showGrid 
                      ? "bg-accent/20 border-accent/50 text-accent" 
                      : "bg-card/90 border-border hover:bg-secondary"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>

              {/* Map Title Overlay */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-accent" />
                    <div>
                      <div className="text-sm font-semibold">{currentMap.name}</div>
                      <div className="text-xs text-muted-foreground">{currentMap.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimap */}
              <AnimatePresence>
                {showMinimap && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-4 right-4 z-20 w-40 h-28 rounded-lg border-2 border-accent/50 overflow-hidden shadow-lg"
                  >
                    <img
                      src={currentMap.image}
                      alt="Minimap"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-accent/30 rounded-lg" />
                    <div className="absolute top-1 right-1">
                      <Compass className="w-4 h-4 text-accent" />
                    </div>
                    <button 
                      onClick={() => setShowMinimap(false)}
                      className="absolute top-1 left-1 p-0.5 bg-card/80 rounded text-xs"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Map Display */}
              <div className="relative h-[600px] overflow-hidden bg-[#0a0f1a]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMap.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `scale(${zoom / 100})` }}
                  >
                    <img
                      src={currentMap.image}
                      alt={currentMap.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: "auto" }}
                    />
                    
                    {/* Grid Overlay */}
                    {showGrid && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: "32px 32px"
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Generation Overlay */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30"
                    >
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                          <Globe2 className="absolute inset-0 m-auto w-10 h-10 text-accent" />
                        </div>
                        <div className="text-lg font-semibold mb-2">Generating World</div>
                        <div className="text-sm text-muted-foreground">
                          Wave Function Collapse in progress...
                        </div>
                        <div className="mt-4 w-64 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-accent"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Stats Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card/30">
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Dimensions:</span>
                    <span className="font-mono">{currentMap.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Biomes:</span>
                    <span>{currentMap.biomes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Regions:</span>
                    <span>{currentMap.regions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Landmarks:</span>
                    <span>{currentMap.landmarks}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Gen Time:</span>
                    <span className="text-accent">{currentMap.generationTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-lg text-xs transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Export Tiled
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-lg text-xs transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Export PNG
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-xs transition-colors hover:bg-accent/90">
                    <Download className="w-3.5 h-3.5" />
                    Export Godot
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - World Info */}
            <div className="w-64 border-l border-border bg-card/30 p-4 space-y-6">
              {/* Region Markers */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Region Markers
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { name: "Capital City", type: "settlement", icon: Castle },
                    { name: "Ancient Forest", type: "biome", icon: Trees },
                    { name: "Mountain Range", type: "terrain", icon: Mountain },
                    { name: "Mystic Lake", type: "water", icon: Waves },
                    { name: "Magic Ruins", type: "landmark", icon: Sparkles },
                    { name: "Trading Post", type: "settlement", icon: MapPin },
                  ].map((marker, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg text-xs"
                    >
                      <marker.icon className="w-3.5 h-3.5 text-accent" />
                      <span className="flex-1">{marker.name}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Generation Stats */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Generation Stats
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Tiles", value: "65,536" },
                    { label: "Paths", value: "847" },
                    { label: "POIs", value: "124" },
                    { label: "Dungeons", value: "8" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-secondary/30 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-accent">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                  Quick Actions
                </label>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-xs transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-xs transition-colors">
                    <Layers className="w-3.5 h-3.5" />
                    Edit Layers
                  </button>
                  <button 
                    onClick={() => setShowMinimap(!showMinimap)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-xs transition-colors"
                  >
                    {showMinimap ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showMinimap ? "Hide Minimap" : "Show Minimap"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
