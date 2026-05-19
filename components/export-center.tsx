"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Download, 
  FileJson, 
  Image, 
  Layers,
  Check,
  ChevronDown,
  Folder
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const engines = [
  { 
    id: "godot", 
    name: "Godot", 
    version: "4.x", 
    color: "#478cbf",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%282%29-30PylI6AGRnBdknSVIDtQmVszEE8aR.jpeg"
  },
  { 
    id: "unity", 
    name: "Unity", 
    version: "2022+", 
    color: "#222c37",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%281%29-oqYNB1sKtQZjSY5ZFsNOUH72Berctl.jpeg"
  },
  { 
    id: "gamemaker", 
    name: "GameMaker", 
    version: "Studio 2", 
    color: "#8bc34a",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42-bMQK2zkOvkPaBQh3RYrAX04wtLDBQu.jpeg"
  },
  { 
    id: "rpgmaker", 
    name: "RPG Maker", 
    version: "MZ/MV", 
    color: "#ff5722",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2017.43.10-c2BnMDUjxAo7YNfhHI2xv3heMpOvXu.jpeg"
  },
]

const formats = [
  { id: "png", icon: Image, label: "PNG", desc: "Imagem com transparência" },
  { id: "spritesheet", icon: Layers, label: "SpriteSheet", desc: "Todos os frames em uma imagem" },
  { id: "json", icon: FileJson, label: "JSON", desc: "Dados de animação e metadados" },
  { id: "tilemap", icon: Folder, label: "Tilemap", desc: "Dados de mapa compatíveis" },
]

const assets = [
  { id: 1, name: "warrior_idle.png", type: "Sprite", size: "32x32", frames: 4 },
  { id: 2, name: "forest_tileset.png", type: "Tileset", size: "256x256", frames: null },
  { id: 3, name: "dungeon_map.json", type: "Mapa", size: "64x48", frames: null },
  { id: 4, name: "slime_attack.png", type: "Animação", size: "48x48", frames: 6 },
]

export function ExportCenter() {
  const [selectedEngine, setSelectedEngine] = useState("godot")
  const [selectedFormats, setSelectedFormats] = useState(["png", "json"])
  const [selectedAssets, setSelectedAssets] = useState<number[]>([1, 2])

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const toggleAsset = (id: number) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-secondary/30">
        <Download className="w-4 h-4 text-accent" />
        <div>
          <h3 className="text-sm font-semibold">Central de Exportação</h3>
          <p className="text-xs text-muted-foreground">Exporte para diferentes engines e formatos</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Engine Selection */}
        <div className="space-y-2">
          <Label className="text-xs">Engine de Destino</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {engines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine.id)}
                className={cn(
                  "p-3 rounded-lg border-2 text-left transition-all",
                  selectedEngine === engine.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/30 hover:border-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-md overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={engine.logo} 
                      alt={engine.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm font-medium">{engine.name}</div>
                <span className="text-xs text-muted-foreground">{engine.version}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label className="text-xs">Formatos de Exportação</Label>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((format) => {
              const Icon = format.icon
              const isSelected = selectedFormats.includes(format.id)
              return (
                <button
                  key={format.id}
                  onClick={() => toggleFormat(format.id)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-secondary/30 hover:border-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{format.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{format.desc}</div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Asset List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Assets para Exportar</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setSelectedAssets(selectedAssets.length === assets.length ? [] : assets.map(a => a.id))}
            >
              {selectedAssets.length === assets.length ? "Limpar" : "Selecionar Todos"}
            </Button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => toggleAsset(asset.id)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                  selectedAssets.includes(asset.id)
                    ? "bg-accent/10"
                    : "bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <Checkbox checked={selectedAssets.includes(asset.id)} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {asset.type} • {asset.size}
                    {asset.frames && ` • ${asset.frames} frames`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground glow-accent">
          <Download className="w-4 h-4 mr-2" />
          Exportar {selectedAssets.length} Assets
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{selectedAssets.length}</div>
            <div className="text-xs text-muted-foreground">Assets</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{selectedFormats.length}</div>
            <div className="text-xs text-muted-foreground">Formatos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">~2.4MB</div>
            <div className="text-xs text-muted-foreground">Tamanho Est.</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
