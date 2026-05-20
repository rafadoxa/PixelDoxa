"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Wand2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const artStyles = [
  "Classic Pixel Art",
  "GBA/SNES Style",
  "Modern Hi-Bit",
  "Minimalist",
  "Detailed",
  "Anime Pixel",
]

const genres = [
  "RPG",
  "Platformer",
  "Metroidvania",
  "Roguelike",
  "Survival",
  "Sci-fi",
  "Fantasy",
  "Horror",
]

const pixelSizes = ["8x8", "16x16", "32x32", "64x64", "128x128"]

const palettes = [
  { name: "Pico-8", colors: ["#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8"] },
  { name: "GameBoy", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] },
  { name: "NES", colors: ["#7c7c7c", "#0000fc", "#0078f8", "#0058f8"] },
  { name: "CGA", colors: ["#000000", "#00aa00", "#aa0000", "#aa5500"] },
]

const perspectives = [
  { id: "topdown", label: "Top-down" },
  { id: "sideview", label: "Side View" },
  { id: "isometric", label: "Isometric" },
  { id: "34view", label: "3/4 View" },
]

const animationTypes = [
  "None",
  "Idle",
  "Walk",
  "Run",
  "Attack",
  "Jump",
  "Death",
  "Complete",
]

export function AIGenerationPanel() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [selectedPerspective, setSelectedPerspective] = useState("sideview")

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary/30">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">AI Generation Panel</h3>
          <p className="text-xs text-muted-foreground">Describe your asset and AI will create it</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Prompt */}
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="E.g. A medieval warrior with iron armor, holding a flaming sword, fantasy style..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-secondary/50 border-border resize-none"
          />
        </div>

        {/* Grid of selectors */}
        <div className="grid grid-cols-2 gap-4">
          {/* Art Style */}
          <div className="space-y-2">
            <Label>Art Style</Label>
            <Select defaultValue={artStyles[0]}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {artStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select defaultValue={genres[0]}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pixel Size */}
          <div className="space-y-2">
            <Label>Pixel Size</Label>
            <Select defaultValue={pixelSizes[2]}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pixelSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Animation */}
          <div className="space-y-2">
            <Label>Animation</Label>
            <Select defaultValue={animationTypes[0]}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {animationTypes.map((anim) => (
                  <SelectItem key={anim} value={anim}>
                    {anim}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Palette Selection */}
        <div className="space-y-2">
          <Label>Color Palette</Label>
          <div className="grid grid-cols-2 gap-2">
            {palettes.map((palette, i) => (
              <button
                key={palette.name}
                onClick={() => setSelectedPalette(i)}
                className={cn(
                  "p-2 rounded-lg border-2 transition-all",
                  selectedPalette === i
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/30 hover:border-muted-foreground"
                )}
              >
                <div className="flex gap-1 mb-1">
                  {palette.colors.slice(0, 4).map((color, j) => (
                    <div
                      key={j}
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{palette.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Perspective */}
        <div className="space-y-2">
          <Label>Camera Perspective</Label>
          <div className="grid grid-cols-4 gap-2">
            {perspectives.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPerspective(p.id)}
                className={cn(
                  "p-2 rounded-lg border-2 text-xs transition-all text-center",
                  selectedPerspective === p.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Detail Level</Label>
            <span className="text-xs text-muted-foreground">75%</span>
          </div>
          <Slider defaultValue={[75]} max={100} step={5} className="w-full" />
        </div>

        {/* Generate Button */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground glow-accent"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Asset
              </>
            )}
          </Button>
          <Button variant="outline" className="border-border">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
