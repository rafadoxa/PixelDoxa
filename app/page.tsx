"use client"

import { useState } from "react"
import { TopNavbar } from "@/components/top-navbar"
import { SidebarToolPanel } from "@/components/sidebar-tool-panel"
import { HeroSection } from "@/components/hero-section"
import { MainWorkspace } from "@/components/main-workspace"
import { AIGenerationPanel } from "@/components/ai-generation-panel"
import { PixelEditor } from "@/components/pixel-editor"
import { ProceduralGenerator } from "@/components/procedural-generator"
import { ExportCenter } from "@/components/export-center"
import { CommunityGallery } from "@/components/community-gallery"
import { SpritesheetSlicer } from "@/components/spritesheet-slicer"
import { PixelDoxaWorkflow } from "@/components/pixeldoxa-workflow"
import { VideoShowcase } from "@/components/video-showcase"
import { AnimationPipeline } from "@/components/animation-pipeline"
import { PixelSprite, PIXEL_SPRITES, PixelScene } from "@/components/pixel-art-showcase"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { Sparkles, Wand2, Grid3X3, Layers, Gamepad2, ArrowRight, Zap, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PixelDoxaApp() {
  const { t } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool] = useState(t.sidebar.tools[0])
  const [showLanding, setShowLanding] = useState(true)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Landing page view
  if (showLanding) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <main className="pt-16">
          {/* Hero */}
          <HeroSection />
          
          {/* Workflow Section */}
          <PixelDoxaWorkflow />
          
          {/* Video Showcase Section */}
          <VideoShowcase />
          
          {/* Animation Pipeline Section */}
          <AnimationPipeline />
          
          {/* Features Section */}
          <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(180 80% 45%) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(180 80% 45%) 1px, transparent 1px)
                  `,
                  backgroundSize: '32px 32px'
                }}
              />
            </div>
            
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/20"
                >
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">{t.features.badge}</span>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t.features.title1}{" "}
                  <span className="text-accent">{t.features.titleAcc}</span>{" "}
                  {t.features.title2}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t.features.subtitle}
                </p>
              </div>
              
              {/* Feature Cards with Pixel Art */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Wand2,    ...t.features.cards.sprite,    sprite: PIXEL_SPRITES.seaOfStarsMage },
                  { icon: Layers,   ...t.features.cards.animation, sprite: PIXEL_SPRITES.drifter        },
                  { icon: Grid3X3,  ...t.features.cards.tileset,   sprite: PIXEL_SPRITES.enchantedTree  },
                  { icon: Gamepad2, ...t.features.cards.engine,    sprite: PIXEL_SPRITES.stonePath      },
                  { icon: Sparkles, ...t.features.cards.vfx,       sprite: PIXEL_SPRITES.crystal        },
                  { icon: Star,     ...t.features.cards.npc,       sprite: PIXEL_SPRITES.mysticOrb      },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                  >
                    {/* Pixel art preview */}
                    <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <PixelSprite 
                          sprite={feature.sprite.sprite} 
                          palette={feature.sprite.palette} 
                          pixelSize={3} 
                        />
                      </motion.div>
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Demo Section */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <AIGenerationPanel />
                </div>
                <div>
                  <MainWorkspace />
                </div>
              </div>
            </div>
          </section>
          
          {/* Pixel Art Scene Section */}
          <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Assets em{" "}
                  <span className="text-accent">tempo real</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Preview instantaneo de sprites, animacoes e elementos de cenario
                </p>
              </div>
              
              <PixelScene />
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {Object.entries(PIXEL_SPRITES).map(([key, data], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-accent/50 transition-all"
                  >
                    <PixelSprite sprite={data.sprite} palette={data.palette} pixelSize={4} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Procedural Generator Showcase */}
          <section className="py-20 px-4 bg-card/50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-primary/20"
                >
                  <Grid3X3 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Wave Function Collapse</span>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Geração{" "}
                  <span className="text-accent">Procedural</span>{" "}
                  de Mundos
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Crie dungeons, florestas, vilas e muito mais com algoritmos avançados
                </p>
              </div>
              <ProceduralGenerator />
            </div>
          </section>
          
          {/* Export Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Exporte para sua{" "}
                  <span className="text-accent">engine favorita</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Compatível com Godot, Unity, GameMaker, RPG Maker e mais
                </p>
              </div>
              <ExportCenter />
            </div>
          </section>
          
          {/* Community Gallery */}
          <CommunityGallery />
          
          {/* Pricing Section */}
          <section className="py-20 px-4 bg-card/50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Escolha seu{" "}
                  <span className="text-accent">plano</span>
                </h2>
                <p className="text-muted-foreground">
                  Comece grátis, faça upgrade quando precisar
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { ...t.pricing.plans.free,   popular: false },
                  { ...t.pricing.plans.pro,    popular: true  },
                  { ...t.pricing.plans.studio, popular: false },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "relative bg-card border rounded-xl p-6",
                      plan.popular ? "border-accent shadow-lg shadow-accent/10" : "border-border"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        {t.pricing.popular}
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{t.pricing.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={cn(
                        "w-full",
                        plan.popular ? "bg-accent hover:bg-accent/90 text-accent-foreground glow-accent" : ""
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-24 px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-accent/20" />
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex justify-center gap-4 mb-8">
                  {Object.entries(PIXEL_SPRITES).slice(0, 3).map(([key, data], i) => (
                    <motion.div
                      key={key}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <PixelSprite sprite={data.sprite} palette={data.palette} pixelSize={5} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Comece seu proximo projeto
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                Pipeline profissional de pixel art para desenvolvedores indie que levam producao a serio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowLanding(false)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent group px-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Agora - Grátis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Ver Documentação
                </Button>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="border-t border-border py-12 px-4 bg-card/50">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {/* Logo */}
                <div className="col-span-2 md:col-span-1">
                  <a href="#" className="inline-block mb-4">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ixel%20%281%29-i4KJfGtEB6A47vkISBmW0KT37cQoye.png"
                      alt="PixelDoxa Logo"
                      className="h-16 w-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Pipeline profissional de pixel art para desenvolvedores indie.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Produto</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Recursos</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Recursos</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Tutoriais</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Comunidade</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Galeria</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Termos</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Licença</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2026 PixelDoxa. Todos os direitos reservados.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Feito com</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-accent"
                  >
                    ♥
                  </motion.div>
                  <span className="text-xs text-muted-foreground">para devs indie</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    )
  }

  // Editor view (full app)
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <SidebarToolPanel
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "pl-0"
        )}
      >
        <div className="p-4 lg:p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button 
              onClick={() => setShowLanding(true)}
              className="hover:text-foreground transition-colors"
            >
              Início
            </button>
            <span>/</span>
            <span className="text-foreground">{activeTool}</span>
          </div>
          
          {/* Tool Content */}

          {/* [0] Character Generator */}
          {activeTool === t.sidebar.tools[0] && (
            <div className="grid lg:grid-cols-2 gap-6">
              <AIGenerationPanel />
              <MainWorkspace />
            </div>
          )}

          {/* [1] Sprite Sheet Slicer — NEW */}
          {activeTool === t.sidebar.tools[1] && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-accent">🎬</span>
                  Sprite Sheet Slicer
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.sidebar.tools[1] === "Sprite Sheet Slicer"
                    ? "Generate frames with AI, arrange them, preview the animation, and export as PNG sprite sheet or animated GIF."
                    : "Gere frames com IA, organize-os, prévia da animação e exporte como PNG sprite sheet ou GIF animado."}
                </p>
              </div>
              <SpritesheetSlicer />
            </div>
          )}

          {/* [2] SpriteSheet Generator */}
          {(activeTool === t.sidebar.tools[2] || activeTool === t.sidebar.tools[3]) && (
            <div className="grid lg:grid-cols-2 gap-6">
              <AIGenerationPanel />
              <MainWorkspace />
            </div>
          )}

          {/* [4] Pixel Editor */}
          {activeTool === t.sidebar.tools[4] && (
            <div className="grid lg:grid-cols-2 gap-6">
              <PixelEditor />
              <MainWorkspace />
            </div>
          )}

          {/* [5] Procedural Map Generator */}
          {activeTool === t.sidebar.tools[5] && (
            <div className="max-w-5xl mx-auto">
              <ProceduralGenerator />
            </div>
          )}

          {/* [6] Export Center */}
          {activeTool === t.sidebar.tools[6] && (
            <div className="max-w-4xl mx-auto">
              <ExportCenter />
            </div>
          )}

          {/* [7] Community */}
          {activeTool === t.sidebar.tools[7] && (
            <CommunityGallery />
          )}

          {/* [8] (extra if any) */}
          {activeTool === t.sidebar.tools[8] && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="text-lg font-semibold mb-4">AI Prompt History</h3>
                <div className="space-y-3">
                  {[
                    { prompt: "Medieval warrior with golden armor, SNES Final Fantasy style", time: "2 min ago" },
                    { prompt: "Enchanted forest tileset with glowing mushrooms", time: "15 min ago" },
                    { prompt: "Green slime enemy with attack and death animation", time: "1 hour ago" },
                    { prompt: "Elemental mage with fire staff, 4 directions", time: "2 hours ago" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                      <p className="text-sm mb-1 group-hover:text-accent transition-colors">{item.prompt}</p>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
