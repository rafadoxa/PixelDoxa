"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, Download, Eye, User, Filter, Search, Star, Play, Sparkles, Layers, Grid3X3, Maximize2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Premium sprite sheet showcase images
const SHOWCASE_IMAGES = {
  swordsmanRed: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-CsuGRMdjgj0c2qo0pC8A6GhYZ3wvwt.png",
    title: "Royal Vanguard",
    description: "Spritesheet completo para personagem cavaleiro medieval. Inclui 6 animacoes: Idle, Walk, Attack com efeitos de slash, Dash, Hurt e Death.",
    author: "CrimsonForge",
    stats: { frames: 56, animations: 6, resolution: "128x128" },
    tags: ["Personagem", "Animacao", "Medieval", "128px"],
    style: "Action RPG"
  },
  rogueBlue: {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-i3jLlgkcUa7CEkye7AcwXp0q4wAfQm.png",
    title: "Arcane Knight",
    description: "Guerreiro mistico com efeitos de energia. Animacoes fluidas com VFX em ataques e dash. Pronto para producao.",
    author: "NeonPixelWorks",
    stats: { frames: 64, animations: 6, resolution: "128x128" },
    tags: ["Personagem", "Animacao", "Fantasy", "128px"],
    style: "Dark Fantasy"
  }
}

// Gallery items combining sprite sheets and individual showcases
const galleryItems = [
  {
    id: 1,
    name: "Royal Vanguard",
    subtitle: "Character Pack - 6 Animacoes",
    author: "CrimsonForge",
    likes: 2847,
    downloads: 1521,
    views: 8472,
    tags: ["Personagem", "128px", "Medieval"],
    featured: true,
    isPremium: true,
    imageKey: "swordsmanRed" as const,
    frameCount: 56,
    animationCount: 6,
    style: "Action RPG",
  },
  {
    id: 2,
    name: "Arcane Knight",
    subtitle: "Character Pack - 6 Animacoes",
    author: "NeonPixelWorks",
    likes: 2193,
    downloads: 1392,
    views: 6456,
    tags: ["Personagem", "128px", "Fantasy"],
    featured: true,
    isPremium: true,
    imageKey: "rogueBlue" as const,
    frameCount: 64,
    animationCount: 6,
    style: "Dark Fantasy",
  },
]

const categories = ["Todos", "Em Destaque", "Personagens", "Tilesets", "Spritesheets", "Ambiente"]

export function CommunityGallery() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === "Todos" 
      ? true 
      : activeCategory === "Em Destaque"
      ? item.featured
      : activeCategory === "Spritesheets"
      ? item.frameCount > 10
      : item.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase().slice(0, -1)))
    
    const matchesSearch = searchQuery === "" 
      ? true 
      : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4"
      id="gallery"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/20"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Assets Premium</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Asset{" "}
            <span className="text-accent">Marketplace</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Spritesheets profissionais criados pela comunidade. Assets prontos para producao com animacoes completas e exportacao direta.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar sprites, tilesets..." 
                className="pl-10 bg-secondary/50 border-border focus:border-accent/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "transition-all",
                  activeCategory === cat && "bg-accent text-accent-foreground glow-accent"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Showcase - Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredItems.filter(i => i.featured).map((item, index) => {
            const imageData = SHOWCASE_IMAGES[item.imageKey]
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] bg-[#2a2f4a] overflow-hidden">
                  {/* Subtle grid overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                      `,
                      backgroundSize: '16px 16px'
                    }}
                  />
                  
                  <Image
                    src={imageData.url}
                    alt={item.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    style={{ imageRendering: "pixelated" }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Gradient overlays for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card/30 via-transparent to-card/30" />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    {item.featured && (
                      <Badge className="bg-accent/90 text-accent-foreground gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Destaque
                      </Badge>
                    )}
                    {item.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Style badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-accent/30">
                      {item.style}
                    </Badge>
                  </div>

                  {/* Expand button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: hoveredItem === item.id ? 1 : 0, scale: hoveredItem === item.id ? 1 : 0.8 }}
                    onClick={() => setExpandedImage(imageData.url)}
                    className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-border hover:border-accent/50 hover:bg-accent/10 transition-all"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>

                  {/* Animation stats overlay */}
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium">
                      <Play className="w-3.5 h-3.5 text-accent" />
                      {item.animationCount} Animacoes
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium">
                      <Layers className="w-3.5 h-3.5 text-accent" />
                      {item.frameCount} Frames
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>{item.author}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(item.id)
                      }}
                      className={cn(
                        "p-3 rounded-xl transition-all",
                        likedItems.includes(item.id)
                          ? "bg-destructive/20 text-destructive"
                          : "bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", likedItems.includes(item.id) && "fill-current")} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {imageData.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        {(likedItems.includes(item.id) ? item.likes + 1 : item.likes).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        {item.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {item.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1.5" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Download className="w-4 h-4 mr-1.5" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Animation breakdown section */}
        <div className="mb-16">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-accent" />
            Animacoes Incluidas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["IDLE", "WALK", "ATTACK", "DASH", "HURT", "DEATH"].map((anim, i) => (
              <motion.div
                key={anim}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-secondary/50 to-secondary border border-border overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Play className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-sm font-semibold">{anim}</span>
                      <p className="text-xs text-muted-foreground mt-1">8-12 frames</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum asset encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros ou busca</p>
          </div>
        )}

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="group">
            <Layers className="w-4 h-4 mr-2" />
            Explorar Mais Assets
            <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Stats section */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-12">
            {[
              { value: "12.5K+", label: "Sprites Premium", icon: Sparkles },
              { value: "8.2K+", label: "Artistas Ativos", icon: User },
              { value: "45K+", label: "Downloads Hoje", icon: Download },
              { value: "98%", label: "Aprovacao", icon: Star },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-accent" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
            >
              <Image
                src={expandedImage}
                alt="Expanded spritesheet"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain rounded-xl"
                style={{ imageRendering: "pixelated" }}
              />
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-accent/50 transition-colors"
              >
                <span className="sr-only">Fechar</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
