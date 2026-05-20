"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Grid3X3,
  Layers,
  Play,
  Map,
  Palette,
  FolderOpen,
  History,
  Download,
  User,
  Sword,
  Trees,
  Ghost,
  Rocket,
  Castle,
  Gamepad2,
  ChevronRight,
  Zap,
} from "lucide-react"
import { PixelSprite, PIXEL_SPRITES } from "@/components/pixel-art-showcase"
import { cn } from "@/lib/utils"

const tools = [
  { icon: User, label: "Character Generator", active: true },
  { icon: Grid3X3, label: "SpriteSheet Generator" },
  { icon: Layers, label: "Tileset Generator" },
  { icon: Play, label: "Animation Creator" },
  { icon: Map, label: "Procedural Map Generator" },
  { icon: Palette, label: "Pixel Editor" },
  { icon: FolderOpen, label: "Asset Library" },
  { icon: History, label: "AI Prompt History" },
  { icon: Download, label: "Export Center" },
]

const genres = [
  { icon: Sword, label: "RPG" },
  { icon: Gamepad2, label: "Platformer" },
  { icon: Ghost, label: "Roguelike" },
  { icon: Trees, label: "Survival" },
  { icon: Rocket, label: "Sci-fi" },
  { icon: Castle, label: "Fantasy" },
]

interface SidebarToolPanelProps {
  activeTool: string
  setActiveTool: (tool: string) => void
}

export function SidebarToolPanel({ activeTool, setActiveTool }: SidebarToolPanelProps) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Quick Pixel Art Preview */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-center gap-3 py-2">
          {Object.entries(PIXEL_SPRITES).slice(0, 3).map(([key, data], i) => (
            <motion.div
              key={key}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <PixelSprite sprite={data.sprite} palette={data.palette} pixelSize={2} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Tools
          </h3>
          <nav className="space-y-1">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeTool === tool.label
              const isHovered = hoveredTool === tool.label

              return (
                <motion.button
                  key={tool.label}
                  onClick={() => setActiveTool(tool.label)}
                  onMouseEnter={() => setHoveredTool(tool.label)}
                  onMouseLeave={() => setHoveredTool(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent/20 text-accent glow-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn("w-4 h-4", isActive && "text-accent")} />
                  <span className="flex-1 text-left truncate">{tool.label}</span>
                  {(isActive || isHovered) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <ChevronRight className="w-4 h-4 text-accent" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </nav>
        </div>

        {/* Genres Section */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Genres
          </h3>
          <div className="grid grid-cols-2 gap-2 px-2">
            {genres.map((genre) => {
              const Icon = genre.icon
              return (
                <motion.button
                  key={genre.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{genre.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-3">
        {/* Pro upgrade banner */}
        <motion.div
          className="glass rounded-lg p-3 border border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Upgrade Pro</span>
          </div>
          <p className="text-xs text-muted-foreground">Unlimited generations + Spritesheets</p>
        </motion.div>
        
        {/* Credits */}
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI Credits</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">750 / 1000 remaining</p>
        </div>
      </div>
    </motion.aside>
  )
}
