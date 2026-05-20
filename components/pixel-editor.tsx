"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Pencil, 
  Eraser, 
  PaintBucket, 
  Pipette,
  Square,
  Circle,
  Move,
  Undo,
  Redo,
  Layers,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const tools = [
  { id: "pencil", icon: Pencil, label: "Pincel" },
  { id: "eraser", icon: Eraser, label: "Borracha" },
  { id: "bucket", icon: PaintBucket, label: "Balde" },
  { id: "picker", icon: Pipette, label: "Conta-gotas" },
  { id: "rect", icon: Square, label: "Retângulo" },
  { id: "circle", icon: Circle, label: "Círculo" },
  { id: "move", icon: Move, label: "Mover" },
]

const defaultPalette = [
  "#000000", "#1d2b53", "#7e2553", "#008751",
  "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
  "#ff004d", "#ffa300", "#ffec27", "#00e436",
  "#29adff", "#83769c", "#ff77a8", "#ffccaa",
]

interface Layer {
  id: number
  name: string
  visible: boolean
  opacity: number
}

export function PixelEditor() {
  const [activeTool, setActiveTool] = useState("pencil")
  const [selectedColor, setSelectedColor] = useState("#fff1e8")
  const [brushSize, setBrushSize] = useState([1])
  const [onionSkin, setOnionSkin] = useState(false)
  const [gridVisible, setGridVisible] = useState(true)
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: "Camada 1", visible: true, opacity: 100 },
    { id: 2, name: "Background", visible: true, opacity: 100 },
  ])
  const [activeLayer, setActiveLayer] = useState(1)
  const [currentFrame, setCurrentFrame] = useState(0)
  const frames = [0, 1, 2, 3, 4, 5, 6, 7]

  const toggleLayerVisibility = (id: number) => {
    setLayers(layers.map(l => 
      l.id === id ? { ...l, visible: !l.visible } : l
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/30">
        <h3 className="text-sm font-semibold">Editor de Pixels</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Tools Panel */}
        <div className="w-12 border-r border-border bg-secondary/20 p-1.5 space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
                className={cn(
                  "w-full aspect-square rounded-lg flex items-center justify-center transition-all",
                  activeTool === tool.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1">
          {/* Canvas Area */}
          <div className="p-4">
            <div 
              className="mx-auto w-64 h-64 rounded-lg bg-background relative overflow-hidden"
              style={{
                backgroundImage: gridVisible ? `
                  linear-gradient(45deg, hsl(240 10% 12%) 25%, transparent 25%),
                  linear-gradient(-45deg, hsl(240 10% 12%) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, hsl(240 10% 12%) 75%),
                  linear-gradient(-45deg, transparent 75%, hsl(240 10% 12%) 75%)
                ` : undefined,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                Clique para desenhar
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="border-t border-border p-3 space-y-3">
            {/* Brush Size */}
            <div className="flex items-center gap-3">
              <Label className="text-xs w-20">Tamanho:</Label>
              <Slider 
                value={brushSize} 
                onValueChange={setBrushSize} 
                max={10} 
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-6">{brushSize}px</span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="onion" 
                  checked={onionSkin}
                  onCheckedChange={setOnionSkin}
                />
                <Label htmlFor="onion" className="text-xs">Onion Skin</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="grid" 
                  checked={gridVisible}
                  onCheckedChange={setGridVisible}
                />
                <Label htmlFor="grid" className="text-xs">Grade</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Layers & Colors */}
        <div className="w-48 border-l border-border bg-secondary/20">
          {/* Color Palette */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Paleta</span>
              <div 
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {defaultPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-5 h-5 rounded-sm transition-all",
                    selectedColor === color && "ring-2 ring-accent ring-offset-1 ring-offset-background"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Layers */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Camadas
              </span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer transition-all",
                    activeLayer === layer.id
                      ? "bg-accent/20 text-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLayerVisibility(layer.id)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </button>
                  <span className="flex-1 truncate">{layer.name}</span>
                  <button className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-border p-2 bg-secondary/20">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center gap-1 overflow-x-auto px-2">
            {frames.map((frame) => (
              <button
                key={frame}
                onClick={() => setCurrentFrame(frame)}
                className={cn(
                  "w-10 h-10 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs transition-all",
                  currentFrame === frame
                    ? "border-accent bg-accent/20 text-foreground"
                    : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                )}
              >
                {frame + 1}
              </button>
            ))}
            <button className="w-10 h-10 rounded border-2 border-dashed border-border flex-shrink-0 flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
