"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { 
  Map, 
  Castle, 
  Trees, 
  Mountain, 
  Building2,
  Waves,
  RefreshCw,
  Download,
  Shuffle,
  Settings2,
  Play,
  Pause,
  Eye,
  Layers,
  Grid3X3,
  Maximize2,
  ZoomIn,
  ZoomOut
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
import { cn } from "@/lib/utils"

const biomes = [
  { id: "mixed", icon: Map, label: "Overworld", color: "text-emerald-400" },
  { id: "dungeon", icon: Castle, label: "Dungeon", color: "text-purple-400" },
  { id: "forest", icon: Trees, label: "Forest", color: "text-green-400" },
  { id: "mountain", icon: Mountain, label: "Mountain", color: "text-stone-400" },
  { id: "village", icon: Building2, label: "Village", color: "text-amber-400" },
  { id: "ocean", icon: Waves, label: "Ocean", color: "text-blue-400" },
]

const algorithms = [
  { id: "wfc", label: "Wave Function Collapse", desc: "Local constraints" },
  { id: "perlin", label: "Perlin Noise", desc: "Natural terrain" },
  { id: "cellular", label: "Cellular Automata", desc: "Organic caves" },
  { id: "bsp", label: "BSP Tree", desc: "Connected rooms" },
  { id: "drunkard", label: "Drunkard Walk", desc: "Random paths" },
]

const mapStats = [
  { label: "Tiles", value: "4,096" },
  { label: "Biomes", value: "6" },
  { label: "POIs", value: "12" },
  { label: "Paths", value: "8" },
]

export function ProceduralGenerator() {
  const [selectedBiome, setSelectedBiome] = useState("mixed")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("wfc")
  const [seed, setSeed] = useState(48291)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(100)
  const [mapWidth, setMapWidth] = useState([64])
  const [mapHeight, setMapHeight] = useState([64])
  const [density, setDensity] = useState([65])
  const [showGrid, setShowGrid] = useState(false)
  const [showLayers, setShowLayers] = useState(true)
  const [zoom, setZoom] = useState(1)

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setSeed(Math.floor(Math.random() * 99999))
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-secondary/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Map className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Procedural World Generator</h3>
            <p className="text-xs text-muted-foreground">Create unique worlds with advanced algorithms</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Seed:</span>
            <code className="bg-secondary px-2 py-1 rounded font-mono text-accent">{seed}</code>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSeed(Math.floor(Math.random() * 99999))}>
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Preview - Main Focus */}
        <div className="flex-1 relative bg-[#f5efe6] min-h-[400px] lg:min-h-[500px]">
          {/* Map Image */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-6 overflow-hidden"
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
          >
            <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/debug%20visuals.%20Avoid%20random%20meaningless%20terrain.%20The%20world%20should%20feel%20alive%20and%20professionally%20desi-KWA5UDkd3UGoTzxCx3bBaxpea0LTFv.png"
                alt="Mapa procedural gerado - mundo isométrico com montanhas, florestas, rios e praias"
                fill
                className="object-contain"
                style={{ imageRendering: 'pixelated' }}
                priority
              />
              
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />
              )}
            </div>
          </div>

          {/* Generation Progress Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 mx-auto border-2 border-accent border-t-transparent rounded-full"
                  />
                  <div>
                  <p className="text-sm font-medium">Generating terrain...</p>
                  <p className="text-xs text-muted-foreground mt-1">Wave Function Collapse running</p>
                  </div>
                  <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Controls - Top Right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-background/90 backdrop-blur-sm shadow-lg"
              onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 bg-background/90 backdrop-blur-sm shadow-lg"
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className={cn(
                "h-8 w-8 bg-background/90 backdrop-blur-sm shadow-lg",
                showGrid && "bg-accent text-accent-foreground"
              )}
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className={cn(
                "h-8 w-8 bg-background/90 backdrop-blur-sm shadow-lg",
                showLayers && "bg-accent text-accent-foreground"
              )}
              onClick={() => setShowLayers(!showLayers)}
            >
              <Layers className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Stats - Bottom Left */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {mapStats.map((stat) => (
              <div key={stat.label} className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Biome Legend - Bottom Right */}
          {showLayers && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Detected Biomes</p>
              <div className="space-y-1.5">
                {[
                  { color: "bg-emerald-500", label: "Forest", percent: "35%" },
                  { color: "bg-stone-500", label: "Mountain", percent: "25%" },
                  { color: "bg-blue-400", label: "Water", percent: "20%" },
                  { color: "bg-amber-600", label: "Plains", percent: "15%" },
                  { color: "bg-yellow-200", label: "Beach", percent: "5%" },
                ].map((biome) => (
                  <div key={biome.label} className="flex items-center gap-2 text-xs">
                    <div className={cn("w-3 h-3 rounded", biome.color)} />
                    <span className="text-muted-foreground flex-1">{biome.label}</span>
                    <span className="font-mono text-foreground">{biome.percent}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 p-4 space-y-5 border-t lg:border-t-0 lg:border-l border-border bg-secondary/20">
          {/* Biome Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">World Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {biomes.map((biome) => {
                const Icon = biome.icon
                return (
                  <button
                    key={biome.id}
                    onClick={() => setSelectedBiome(biome.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-xs transition-all",
                      selectedBiome === biome.id
                        ? "bg-accent/20 text-accent border border-accent shadow-lg shadow-accent/10"
                        : "bg-secondary/50 text-muted-foreground border border-transparent hover:border-border hover:bg-secondary"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", selectedBiome === biome.id && biome.color)} />
                    <span>{biome.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Generation Algorithm</Label>
            <div className="space-y-1.5">
              {algorithms.slice(0, 3).map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgorithm(algo.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-all",
                    selectedAlgorithm === algo.id
                      ? "bg-accent/20 text-accent border border-accent"
                      : "bg-secondary/50 text-muted-foreground border border-transparent hover:border-border"
                  )}
                >
                  <span className="font-medium">{algo.label}</span>
                  <span className="text-[10px] opacity-60">{algo.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Controls */}
          <div className="space-y-3">
            <Label className="text-xs font-medium">Map Dimensions</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Width</span>
                  <span className="font-mono text-accent">{mapWidth}px</span>
                </div>
                <Slider 
                  value={mapWidth} 
                  onValueChange={setMapWidth} 
                  min={32} 
                  max={256} 
                  step={16}
                  className="[&_[role=slider]]:bg-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-mono text-accent">{mapHeight}px</span>
                </div>
                <Slider 
                  value={mapHeight} 
                  onValueChange={setMapHeight} 
                  min={32} 
                  max={256} 
                  step={16}
                  className="[&_[role=slider]]:bg-accent"
                />
              </div>
            </div>
          </div>

          {/* Density */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <Label className="font-medium">Detail Density</Label>
              <span className="font-mono text-accent">{density}%</span>
            </div>
            <Slider 
              value={density} 
              onValueChange={setDensity} 
              min={20} 
              max={90} 
              step={5}
              className="[&_[role=slider]]:bg-accent"
            />
          </div>

          {/* WFC Advanced Controls */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium">WFC Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" className="text-xs h-9">
                <Play className="w-3 h-3 mr-1.5" />
                Single Step
              </Button>
              <Button variant="secondary" size="sm" className="text-xs h-9">
                <Pause className="w-3 h-3 mr-1.5" />
                Pause
              </Button>
            </div>
            <Button variant="secondary" size="sm" className="w-full text-xs h-9">
              <Eye className="w-3 h-3 mr-1.5" />
              View Propagation
            </Button>
          </div>

          {/* Main Actions */}
          <div className="flex gap-2 pt-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-sm h-10 font-medium"
            >
              {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                Generate World
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
