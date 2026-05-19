"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Lightbulb, 
  MessageSquareText, 
  Users, 
  Film, 
  Grid3X3, 
  Globe, 
  Download,
  Sparkles,
  Play,
  Pause,
  Check,
  Layers,
  Palette,
  Zap
} from "lucide-react"
import { PixelSprite, PIXEL_SPRITES, AnimatedSprite } from "./pixel-art-showcase"
import Image from "next/image"

// Professional tileset image URL
const TILESET_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_vsoxa5vsoxa5vsox-02DlWAoOQoq5K1136inqxavqyB0ie6.png"

// Engine data for export step
const ENGINES = [
  { 
    name: "Godot", 
    color: "#478CBF", 
    icon: "GD",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%282%29-30PylI6AGRnBdknSVIDtQmVszEE8aR.jpeg"
  },
  { 
    name: "Unity", 
    color: "#222C37", 
    icon: "U",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%281%29-oqYNB1sKtQZjSY5ZFsNOUH72Berctl.jpeg"
  },
  { 
    name: "GameMaker", 
    color: "#8BC34A", 
    icon: "GM",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42-bMQK2zkOvkPaBQh3RYrAX04wtLDBQu.jpeg"
  },
  { 
    name: "RPG Maker", 
    color: "#FF5722", 
    icon: "RM",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2017.43.10-c2BnMDUjxAo7YNfhHI2xv3heMpOvXu.jpeg"
  },
]

// Workflow step data
const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "Conceito",
    subtitle: "Visao Criativa",
    description: "Defina a estetica do seu jogo - genero, atmosfera, referencias visuais",
    icon: Lightbulb,
    color: "#FFB347",
    preview: "concept",
  },
  {
    id: 2,
    title: "Prompt IA",
    subtitle: "Descricao Detalhada",
    description: "Descreva seus assets com precisao - estilo, cores, poses, animacoes",
    icon: MessageSquareText,
    color: "#87CEEB",
    preview: "prompt",
  },
  {
    id: 3,
    title: "Personagens",
    subtitle: "Sprite Generation",
    description: "A IA gera personagens unicos com variacoes, expressoes e poses",
    icon: Users,
    color: "#98D8C8",
    preview: "characters",
  },
  {
    id: 4,
    title: "Animacao",
    subtitle: "SpriteSheet Pro",
    description: "Crie walk cycles, ataques, idle animations e efeitos especiais",
    icon: Film,
    color: "#DDA0DD",
    preview: "animation",
  },
  {
    id: 5,
    title: "Tilesets",
    subtitle: "Seamless Tiles",
    description: "Gere tiles que conectam perfeitamente - florestas, dungeons, vilas",
    icon: Grid3X3,
    color: "#90EE90",
    preview: "tilesets",
  },
  {
    id: 6,
    title: "Mundos",
    subtitle: "Procedural Gen",
    description: "Use WFC para gerar mapas completos com biomas e estruturas",
    icon: Globe,
    color: "#F0E68C",
    preview: "worlds",
  },
  {
    id: 7,
    title: "Exportar",
    subtitle: "Game-Ready",
    description: "Exporte para Godot, Unity, GameMaker, RPG Maker e mais",
    icon: Download,
    color: "#87CEFA",
    preview: "export",
  },
]

// Step card component
function WorkflowStep({ 
  step, 
  index, 
  isActive, 
  onClick 
}: { 
  step: typeof WORKFLOW_STEPS[0]; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon
  
  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
    >
      {/* Connection line to next step */}
      {index < WORKFLOW_STEPS.length - 1 && (
        <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-1rem)] h-0.5">
          <div className="h-full bg-border" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-accent to-accent/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      )}
      
      {/* Card */}
      <motion.div
        className={`relative w-full p-3 lg:p-4 rounded-xl border transition-all duration-300 ${
          isActive 
            ? "bg-card border-accent shadow-lg shadow-accent/10" 
            : "bg-card/50 border-border hover:border-accent/50 hover:bg-card/80"
        }`}
        whileHover={{ y: -2 }}
      >
        {/* Step number badge */}
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
          style={{ backgroundColor: step.color, color: "#000" }}
        >
          {step.id}
        </div>
        
        {/* Icon */}
        <div 
          className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 lg:mb-3 transition-all ${
            isActive ? "bg-accent/20 shadow-inner" : "bg-muted"
          }`}
        >
          <Icon 
            className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors ${isActive ? "text-accent" : "text-muted-foreground"}`} 
          />
        </div>
        
        {/* Text */}
        <div className="text-center">
          <h4 className="font-semibold text-xs lg:text-sm mb-0.5">{step.title}</h4>
          <p className="text-[10px] lg:text-xs text-accent mb-1 hidden sm:block">{step.subtitle}</p>
          <p className="text-[10px] lg:text-xs text-muted-foreground line-clamp-2 hidden md:block">{step.description}</p>
        </div>
        
        {/* Active glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-accent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// Preview panel for each step
function StepPreview({ activeStep }: { activeStep: number }) {
  const step = WORKFLOW_STEPS[activeStep]
  const [isPlaying, setIsPlaying] = useState(true)
  
  const renderPreview = () => {
    switch (step.preview) {
      case "concept":
        return (
          <div className="relative h-full flex flex-col">
            {/* Mood board header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Mood Board</span>
              </div>
              <div className="flex gap-2">
                {["Fantasy", "Dark", "Atmospheric"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Mood board grid */}
            <div className="flex-1 p-4 grid grid-cols-3 gap-3">
              <motion.div
                className="col-span-2 row-span-2 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-accent/20 overflow-hidden relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/40 text-xs text-accent">Referencia Principal</div>
                <div className="h-full flex items-center justify-center">
                  <div className="flex gap-6 items-end">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <PixelSprite sprite={PIXEL_SPRITES.drifter.sprite} palette={PIXEL_SPRITES.drifter.palette} pixelSize={5} />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
                    >
                      <PixelSprite sprite={PIXEL_SPRITES.seaOfStarsMage.sprite} palette={PIXEL_SPRITES.seaOfStarsMage.palette} pixelSize={5} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="rounded-xl bg-card border border-border p-3 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <PixelSprite sprite={PIXEL_SPRITES.crystal.sprite} palette={PIXEL_SPRITES.crystal.palette} pixelSize={4} />
              </motion.div>
              
              <motion.div
                className="rounded-xl bg-card border border-border p-3 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PixelSprite sprite={PIXEL_SPRITES.enchantedTree.sprite} palette={PIXEL_SPRITES.enchantedTree.palette} pixelSize={2} />
              </motion.div>
            </div>
          </div>
        )
        
      case "prompt":
        return (
          <div className="relative h-full flex flex-col p-4">
            {/* Prompt input */}
            <motion.div 
              className="rounded-xl bg-card border border-accent/30 p-4 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareText className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent font-medium">Prompt Criativo</span>
                <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 text-xs text-accent">
                  <Sparkles className="w-3 h-3" />
                  IA Ativa
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                <span className="text-foreground font-medium">&quot;Guerreiro mistico</span>{" "}
                <span className="text-muted-foreground">com</span>{" "}
                <span className="text-cyan-400">capa azul luminosa</span>
                <span className="text-muted-foreground">, armadura leve dourada,</span>{" "}
                <span className="text-purple-400">estilo dark fantasy</span>
                <span className="text-muted-foreground">, pose heroica,</span>{" "}
                <span className="text-foreground font-medium">32x32 pixels&quot;</span>
              </p>
            </motion.div>
            
            {/* Style tags */}
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">Estilos detectados:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Dark Fantasy", color: "#00d4ff" },
                  { label: "Action RPG", color: "#a855f7" },
                  { label: "32x32", color: "#22c55e" },
                ].map((style, i) => (
                  <motion.span
                    key={style.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5"
                    style={{ borderColor: style.color + "40", backgroundColor: style.color + "10", color: style.color }}
                  >
                    <Check className="w-3 h-3" />
                    {style.label}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* Suggested additions */}
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-2">Adicionar ao prompt:</div>
              <div className="flex flex-wrap gap-2">
                {["+ idle animation", "+ 4-frame walk", "+ attack pose", "+ death sprite", "+ hurt frame"].map((mod, i) => (
                  <motion.button
                    key={mod}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-accent/20 border border-border hover:border-accent/50 transition-all"
                  >
                    {mod}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )
        
      case "characters":
        return (
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Personagens Gerados</span>
              </div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent">4 variacoes prontas</span>
              </motion.div>
            </div>
            
            {/* Character grid */}
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-6">
                {[
                  { sprite: PIXEL_SPRITES.drifter, label: "Drifter", stars: 5 },
                  { sprite: PIXEL_SPRITES.seaOfStarsMage, label: "Celestial", stars: 4 },
                  { sprite: PIXEL_SPRITES.eastwardGirl, label: "Aventureira", stars: 5 },
                  { sprite: PIXEL_SPRITES.mortaWarrior, label: "Guerreiro", stars: 4 },
                ].map((char, i) => (
                  <motion.div
                    key={char.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      className="relative p-4 rounded-xl bg-gradient-to-b from-card to-card/50 border border-border hover:border-accent/50 transition-all cursor-pointer group"
                      whileHover={{ y: -6, scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                      >
                        <PixelSprite 
                          sprite={char.sprite.sprite} 
                          palette={char.sprite.palette} 
                          pixelSize={4} 
                        />
                      </motion.div>
                      {/* Selection indicator */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-3 h-3 text-background" />
                      </div>
                    </motion.div>
                    <span className="text-xs text-muted-foreground mt-2">{char.label}</span>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: char.stars }).map((_, j) => (
                        <div key={j} className="w-2 h-2 rounded-full bg-accent/80" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )
        
      case "animation":
        return (
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">hero_walk_cycle.png</span>
                <span className="text-xs text-muted-foreground">32x32 - 4 frames</span>
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-muted hover:bg-accent/20 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Spritesheet preview */}
            <div className="flex-1 p-4 flex flex-col">
              {/* Frame strip */}
              <div className="flex justify-center gap-3 mb-4">
                {[0, 1, 2, 3].map((frame) => (
                  <motion.div
                    key={frame}
                    className="p-3 rounded-xl bg-card border-2 transition-colors"
                    animate={{ 
                      borderColor: isPlaying && frame === Math.floor(Date.now() / 200) % 4 
                        ? "oklch(0.65 0.25 180)" 
                        : "transparent",
                      scale: isPlaying && frame === Math.floor(Date.now() / 200) % 4 ? 1.05 : 1
                    }}
                  >
                    <PixelSprite 
                      sprite={PIXEL_SPRITES.drifter.sprite} 
                      palette={PIXEL_SPRITES.drifter.palette} 
                      pixelSize={3} 
                    />
                    <div className="text-center text-xs text-muted-foreground mt-1">F{frame + 1}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Live preview */}
              <div className="flex-1 flex items-center justify-center">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-card to-muted/30 border border-border">
                  <AnimatedSprite
                    frames={[PIXEL_SPRITES.drifter.sprite, PIXEL_SPRITES.seaOfStarsMage.sprite]}
                    palette={PIXEL_SPRITES.drifter.palette}
                    pixelSize={6}
                    frameRate={isPlaying ? 300 : 99999}
                  />
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-4 h-10 bg-muted rounded-xl flex items-center px-2 gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 h-6 rounded"
                    style={{
                      backgroundColor: i % 8 < 4 ? "oklch(0.65 0.25 180 / 0.3)" : "oklch(0.65 0.25 180 / 0.1)"
                    }}
                    animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 0.5, delay: i * 0.03, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )
        
      case "tilesets":
        return (
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Tileset Collection</span>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400 border border-green-500/30">8 Sets</span>
                <span className="px-2 py-0.5 text-xs rounded bg-accent/20 text-accent border border-accent/30">16x16</span>
              </div>
            </div>
            
            {/* Professional tileset image */}
            <div className="flex-1 p-4 flex items-center justify-center">
              <motion.div
                className="relative w-full h-full max-h-[400px] rounded-xl overflow-hidden border border-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Image
                  src={TILESET_IMAGE}
                  alt="Professional pixel art tileset collection - Fantasy Forest, Dungeon, Medieval Village, Cave, Sci-Fi, Water, Cliff, and Props"
                  fill
                  className="object-contain"
                  style={{ imageRendering: "pixelated" }}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                {/* Overlay labels */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Forest", "Dungeon", "Village", "Cave", "Sci-Fi", "Water", "Cliff", "Props"].map((name, i) => (
                      <motion.span
                        key={name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="px-2 py-1 text-xs rounded bg-card/80 border border-border backdrop-blur-sm"
                      >
                        {name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )
        
      case "worlds":
        return (
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Geracao Procedural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Algoritmo:</span>
                <span className="px-2 py-0.5 text-xs rounded bg-accent/20 text-accent border border-accent/30">Wave Function Collapse</span>
              </div>
            </div>
            
            {/* World generation preview using tileset */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-4">
              <motion.div
                className="relative rounded-xl overflow-hidden border border-border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Image
                  src={TILESET_IMAGE}
                  alt="Tileset source"
                  fill
                  className="object-cover object-left-top"
                  style={{ imageRendering: "pixelated" }}
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-accent">
                  Source Tiles
                </div>
              </motion.div>
              
              <motion.div
                className="relative rounded-xl overflow-hidden border border-accent/30 bg-gradient-to-br from-card to-muted/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-accent border-t-transparent"
                    />
                    <span className="text-sm text-accent">Gerando mapa...</span>
                    <div className="mt-2 flex justify-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-accent"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-green-400">
                  Generated World
                </div>
              </motion.div>
            </div>
            
            {/* Generation stats */}
            <div className="p-4 border-t border-border grid grid-cols-4 gap-4">
              {[
                { label: "Tiles", value: "2,048" },
                { label: "Biomas", value: "6" },
                { label: "POIs", value: "12" },
                { label: "Caminhos", value: "8" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-lg font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )
        
      case "export":
        return (
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Exportar Assets</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Pronto para exportar</span>
              </div>
            </div>
            
            {/* Export preview with tileset */}
            <div className="flex-1 p-4 flex gap-4">
              {/* Preview */}
              <div className="flex-1 relative rounded-xl overflow-hidden border border-border">
                <Image
                  src={TILESET_IMAGE}
                  alt="Assets to export"
                  fill
                  className="object-cover"
                  style={{ imageRendering: "pixelated" }}
                  sizes="500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">complete_tileset_pack.zip</span>
                    <span className="text-xs text-muted-foreground">2.4 MB</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent to-green-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Export options */}
              <div className="w-48 space-y-3">
                <div className="text-xs text-muted-foreground mb-2">Engine Target:</div>
                {ENGINES.map((engine, i) => (
                  <motion.button
                    key={engine.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      i === 0 
                        ? "bg-accent/10 border-accent/50" 
                        : "bg-card border-border hover:border-accent/30"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                      <img 
                        src={engine.logo} 
                        alt={engine.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{engine.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {i === 0 ? "Selecionado" : "Clique para selecionar"}
                      </div>
                    </div>
                    {i === 0 && <Check className="w-4 h-4 text-accent ml-auto" />}
                  </motion.button>
                ))}
                
                {/* Export button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full p-3 rounded-xl bg-accent text-background font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Exportar Agora
                </motion.button>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <motion.div
      key={activeStep}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      {renderPreview()}
    </motion.div>
  )
}

export function PixelDoxaWorkflow() {
  const [activeStep, setActiveStep] = useState(0)
  
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Layers className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Workflow Completo</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Do Conceito ao <span className="text-accent">Game-Ready</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Uma pipeline profissional de criacao de assets que transforma suas ideias em sprites, 
            animacoes e mundos prontos para seu jogo
          </p>
        </motion.div>
        
        {/* Workflow steps */}
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4 mb-8 lg:mb-12">
          {WORKFLOW_STEPS.map((step, index) => (
            <WorkflowStep
              key={step.id}
              step={step}
              index={index}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
        
        {/* Preview panel */}
        <motion.div
          className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ minHeight: "500px" }}
        >
          <StepPreview activeStep={activeStep} />
        </motion.div>
        
        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {WORKFLOW_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeStep === index 
                  ? "bg-accent w-6" 
                  : "bg-muted hover:bg-accent/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
