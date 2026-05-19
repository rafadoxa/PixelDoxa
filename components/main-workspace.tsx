"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Grid3X3, 
  Layers, 
  Play,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const workspaceTabs = [
  { id: "sprite", label: "Preview de Sprite", icon: User },
  { id: "animation", label: "Preview de Animação", icon: Play },
  { id: "tilemap", label: "Preview de Tilemap", icon: Grid3X3 },
  { id: "editor", label: "Canvas do Editor", icon: Layers },
]

// Pixel art character preview (simple pixel grid)
function PixelArtPreview() {
  const pixelGrid = [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,2,2,2,2,1,0,0],
    [0,1,2,2,2,2,2,2,1,0],
    [0,1,2,3,2,2,3,2,1,0],
    [0,1,2,2,2,2,2,2,1,0],
    [0,1,2,2,4,4,2,2,1,0],
    [0,0,1,2,2,2,2,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,5,5,5,5,1,0,0],
    [0,1,5,5,5,5,5,5,1,0],
    [1,5,5,5,5,5,5,5,5,1],
    [1,5,5,1,1,1,1,5,5,1],
    [0,1,1,0,0,0,0,1,1,0],
    [0,1,6,0,0,0,0,6,1,0],
    [0,1,6,0,0,0,0,6,1,0],
    [0,0,1,0,0,0,0,1,0,0],
  ]

  const colors: Record<number, string> = {
    0: "transparent",
    1: "oklch(0.25 0.02 260)", // outline
    2: "oklch(0.75 0.15 80)", // skin
    3: "oklch(0.3 0.1 260)", // eyes
    4: "oklch(0.6 0.2 15)", // mouth
    5: "oklch(0.5 0.2 280)", // shirt
    6: "oklch(0.35 0.1 250)", // pants
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pixelated"
        style={{ imageRendering: 'pixelated' }}
      >
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${pixelGrid[0].length}, 1fr)` }}>
          {pixelGrid.map((row, y) =>
            row.map((pixel, x) => (
              <motion.div
                key={`${x}-${y}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (x + y) * 0.01 }}
                className="w-6 h-6 md:w-8 md:h-8"
                style={{ backgroundColor: colors[pixel] }}
              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Animation frames preview
function AnimationPreview() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const frames = [
    "Frame 1 - Idle",
    "Frame 2 - Move",
    "Frame 3 - Jump",
    "Frame 4 - Attack",
  ]

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-6">
      <div className="w-48 h-48 bg-secondary rounded-lg flex items-center justify-center">
        <motion.div
          key={currentFrame}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-muted-foreground text-sm"
        >
          {frames[currentFrame]}
        </motion.div>
      </div>
      
      {/* Timeline */}
      <div className="flex gap-2">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentFrame(i)}
            className={cn(
              "w-12 h-12 rounded border-2 transition-all",
              currentFrame === i
                ? "border-accent bg-accent/20"
                : "border-border bg-secondary hover:border-muted-foreground"
            )}
          >
            <span className="text-xs text-muted-foreground">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Tilemap preview
function TilemapPreview() {
  const tilemap = Array.from({ length: 8 }, () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 4))
  )

  const tileColors = [
    "oklch(0.35 0.1 145)", // grass
    "oklch(0.45 0.05 80)", // dirt
    "oklch(0.5 0.15 210)", // water
    "oklch(0.3 0.02 260)", // stone
  ]

  return (
    <div className="flex items-center justify-center p-8">
      <div className="grid gap-0.5 bg-background p-2 rounded-lg">
        {tilemap.map((row, y) => (
          <div key={y} className="flex gap-0.5">
            {row.map((tile, x) => (
              <motion.div
                key={`${x}-${y}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (x + y) * 0.02 }}
                className="w-6 h-6 md:w-8 md:h-8 rounded-sm"
                style={{ backgroundColor: tileColors[tile] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Editor canvas preview
function EditorCanvasPreview() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Grid overlay */}
        <div 
          className="w-64 h-64 md:w-80 md:h-80 rounded-lg bg-secondary/50"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.3 0.02 260) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.3 0.02 260) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          Canvas 32x32
        </div>
      </div>
    </div>
  )
}

export function MainWorkspace() {
  const [activeTab, setActiveTab] = useState("sprite")
  const [zoom, setZoom] = useState(100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/30">
        <h3 className="text-sm font-semibold">Área de Trabalho</h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(Math.min(400, zoom + 25))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
          {workspaceTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3",
                  "text-muted-foreground data-[state=active]:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="min-h-[400px] bg-background/50">
          <TabsContent value="sprite" className="m-0">
            <PixelArtPreview />
          </TabsContent>
          <TabsContent value="animation" className="m-0">
            <AnimationPreview />
          </TabsContent>
          <TabsContent value="tilemap" className="m-0">
            <TilemapPreview />
          </TabsContent>
          <TabsContent value="editor" className="m-0">
            <EditorCanvasPreview />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
