"use client"

import { motion } from "framer-motion"
import { Sparkles, Wand2, Play, ChevronRight, Zap, Layers, Grid3X3, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Cinematic Pixel Art Background */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%282%29-vecuQBPhE0488jXJmfrqK7YNwDRJ0V.png"
          alt="Epic fantasy pixel art landscape with a hero overlooking a vast kingdom at sunset"
          fill
          priority
          className="object-cover object-center"
          style={{ imageRendering: "auto" }}
          quality={100}
        />
        
        {/* Left side gradient for text readability - stronger on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        
        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 40}%`,
              width: 2,
              height: 2,
              backgroundColor: i % 3 === 0 
                ? "oklch(0.65 0.25 180 / 0.5)" 
                : i % 3 === 1 
                ? "oklch(0.7 0.2 30 / 0.4)" 
                : "oklch(0.6 0.2 280 / 0.3)",
            }}
            animate={{
              y: [Math.random() * 500 + 300, -20],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 14 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content - left aligned for dark side of image */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm mb-6 border border-accent/30"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">
              Pipeline Profissional de Pixel Art
            </span>
            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full font-medium">
              Studio
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center shadow-lg shadow-accent/30">
                <Grid3X3 className="w-7 h-7 text-foreground" />
              </div>
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-sm"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Pixel<span className="text-accent">Doxa</span>
              </h2>
              <p className="text-xs text-muted-foreground">Pixel Art Studio Profissional</p>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Assets{" "}
            <span className="text-accent" style={{ textShadow: "0 0 40px oklch(0.65 0.25 180 / 0.5)" }}>
              Game-Ready
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">
              Pixel Art
            </span>{" "}
            Pipeline
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-xl"
          >
            Plataforma completa para criacao de sprites, spritesheets animados e tilesets. 
            Integracao direta com{" "}
            <span className="text-foreground font-medium">Godot</span>,{" "}
            <span className="text-foreground font-medium">Unity</span> e{" "}
            <span className="text-foreground font-medium">GameMaker</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-8"
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 group px-8 h-14 text-lg"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Começar a Criar
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 bg-background/40 backdrop-blur-sm hover:bg-secondary/80 group h-14 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Showcase
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            {[
              { icon: Zap, label: "Export Game-Ready" },
              { icon: Layers, label: "Animation Pipeline" },
              { icon: Grid3X3, label: "Tileset Workflow" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-lg text-sm text-muted-foreground border border-border/30"
              >
                <feature.icon className="w-4 h-4 text-accent" />
                {feature.label}
              </div>
            ))}
          </motion.div>

          {/* Engine Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mb-10"
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Compativel com</p>
            <div className="flex items-center gap-4">
              {[
                { 
                  name: "Godot", 
                  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%282%29-30PylI6AGRnBdknSVIDtQmVszEE8aR.jpeg",
                  height: "h-7"
                },
                { 
                  name: "Unity", 
                  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42%20%281%29-oqYNB1sKtQZjSY5ZFsNOUH72Berctl.jpeg",
                  height: "h-6"
                },
                { 
                  name: "GameMaker", 
                  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2014.45.42-bMQK2zkOvkPaBQh3RYrAX04wtLDBQu.jpeg",
                  height: "h-7"
                },
                { 
                  name: "RPG Maker", 
                  logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-15%20at%2017.43.10-c2BnMDUjxAo7YNfhHI2xv3heMpOvXu.jpeg",
                  height: "h-5"
                },
              ].map((engine, i) => (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="relative group"
                >
                  <img
                    src={engine.logo}
                    alt={`${engine.name} Logo`}
                    className={`${engine.height} w-auto opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">25K+</span> artistas
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-muted-foreground">4.9/5</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating UI elements - positioned on right side */}
      <motion.div
        className="absolute top-32 right-8 md:right-16 px-4 py-3 bg-background/70 backdrop-blur-sm rounded-xl border border-accent/20 shadow-xl hidden lg:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div>
            <div className="text-foreground font-medium">Gerando Spritesheet</div>
            <div className="text-xs text-muted-foreground">6 animacoes - 64 frames</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 right-8 md:right-16 px-4 py-3 bg-background/70 backdrop-blur-sm rounded-xl border border-primary/20 shadow-xl hidden lg:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-accent" />
          <div className="text-sm">
            <span className="text-accent font-bold">+3.2K</span>
            <span className="text-muted-foreground ml-1">downloads hoje</span>
          </div>
        </div>
      </motion.div>

      {/* Stats bar at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: "180K+", label: "Assets Exportados" },
              { value: "12K+", label: "Desenvolvedores" },
              { value: "850+", label: "Projetos Ativos" },
              { value: "4.9", label: "Avaliacao" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <motion.div 
                  className="text-xl md:text-2xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
