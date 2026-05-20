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
import { PixelDoxaWorkflow } from "@/components/pixeldoxa-workflow"
import { VideoShowcase } from "@/components/video-showcase"
import { AnimationPipeline } from "@/components/animation-pipeline"
import { PixelSprite, PIXEL_SPRITES, PixelScene } from "@/components/pixel-art-showcase"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Sparkles, Wand2, Grid3X3, Layers, Gamepad2, ArrowRight, Zap, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PixelDoxaApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool] = useState("Gerador de Personagens")
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
                  <span className="text-sm text-muted-foreground">Ferramentas Profissionais</span>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pipeline completo de{" "}
                  <span className="text-accent">producao de assets</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ferramentas profissionais de criacao, animacao e exportacao para desenvolvedores indie
                </p>
              </div>
              
              {/* Feature Cards with Pixel Art */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: Wand2,
                    title: "Sprite Generation",
                    description: "Crie personagens unicos a partir de descricoes textuais detalhadas",
                    sprite: PIXEL_SPRITES.seaOfStarsMage,
                  },
                  {
                    icon: Layers,
                    title: "Animation Pipeline",
                    description: "Walk cycles, attacks, idle e estados completos em um workflow",
                    sprite: PIXEL_SPRITES.drifter,
                  },
                  {
                    icon: Grid3X3,
                    title: "Tileset Workflow",
                    description: "Tilesets seamless para level design com auto-tiling integrado",
                    sprite: PIXEL_SPRITES.enchantedTree,
                  },
                  {
                    icon: Gamepad2,
                    title: "Engine Integration",
                    description: "Exporte para Godot, Unity, GameMaker com formatos nativos",
                    sprite: PIXEL_SPRITES.stonePath,
                  },
                  {
                    icon: Sparkles,
                    title: "VFX Assets",
                    description: "Particulas, efeitos de impacto e elementos visuais animados",
                    sprite: PIXEL_SPRITES.crystal,
                  },
                  {
                    icon: Star,
                    title: "NPC Library",
                    description: "Inimigos, NPCs e criaturas com spritesheets completos",
                    sprite: PIXEL_SPRITES.mysticOrb,
                  },
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
                  {
                    name: "Free",
                    price: "R$0",
                    period: "/mês",
                    description: "Para experimentar",
                    features: ["50 gerações/mês", "Resolução até 64x64", "Formatos PNG básico", "Comunidade"],
                    cta: "Começar Grátis",
                    popular: false,
                  },
                  {
                    name: "Pro",
                    price: "R$49",
                    period: "/mês",
                    description: "Para desenvolvedores indie",
                    features: ["Gerações ilimitadas", "Até 256x256", "Todos os formatos", "Spritesheets", "Animações", "Sem marca d'água"],
                    cta: "Começar Pro",
                    popular: true,
                  },
                  {
                    name: "Studio",
                    price: "R$149",
                    period: "/mês",
                    description: "Para times",
                    features: ["Tudo do Pro", "5 membros", "API access", "Prioridade", "Assets exclusivos", "Suporte dedicado"],
                    cta: "Contatar Vendas",
                    popular: false,
                  },
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
                        Mais Popular
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
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
          {(activeTool === "Gerador de Personagens" || 
            activeTool === "Gerador de SpriteSheet" ||
            activeTool === "Gerador de Tileset") && (
            <div className="grid lg:grid-cols-2 gap-6">
              <AIGenerationPanel />
              <MainWorkspace />
            </div>
          )}
          
          {activeTool === "Criador de Animações" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <PixelEditor />
              <MainWorkspace />
            </div>
          )}
          
          {activeTool === "Gerador Procedural de Mapas" && (
            <div className="max-w-5xl mx-auto">
              <ProceduralGenerator />
            </div>
          )}
          
          {activeTool === "Editor de Pixels" && (
            <div className="max-w-5xl mx-auto">
              <PixelEditor />
            </div>
          )}
          
          {activeTool === "Biblioteca de Assets" && (
            <CommunityGallery />
          )}
          
          {activeTool === "Histórico de Prompts IA" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="text-lg font-semibold mb-4">Histórico de Prompts</h3>
                <div className="space-y-3">
                  {[
                    { prompt: "Um guerreiro medieval com armadura dourada, estilo SNES Final Fantasy", time: "2 min atrás" },
                    { prompt: "Tileset de floresta encantada com cogumelos brilhantes", time: "15 min atrás" },
                    { prompt: "Slime inimigo verde com animação de ataque e morte", time: "1 hora atrás" },
                    { prompt: "Mago elemental com cajado de fogo, 4 direções", time: "2 horas atrás" },
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
          
          {activeTool === "Central de Exportação" && (
            <div className="max-w-4xl mx-auto">
              <ExportCenter />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
