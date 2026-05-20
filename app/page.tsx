"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TopNavbar } from "@/components/top-navbar"
import { HeroSection } from "@/components/hero-section"
import { PixelDoxaWorkflow } from "@/components/pixeldoxa-workflow"
import { AIGenerationPanel } from "@/components/ai-generation-panel"
import { MainWorkspace } from "@/components/main-workspace"
import { ProceduralGenerator } from "@/components/procedural-generator"
import { ExportCenter } from "@/components/export-center"
import { CommunityGallery } from "@/components/community-gallery"
import { PixelSprite, PIXEL_SPRITES, PixelScene } from "@/components/pixel-art-showcase"
import { cn } from "@/lib/utils"
import {
  Sparkles, Wand2, Grid3X3, Layers, Gamepad2,
  ArrowRight, Zap, Check, Star
} from "lucide-react"

export default function PixelDoxaApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="pt-16">

        {/* ── HERO ─────────────────────────────────────── */}
        <HeroSection />

        {/* ── WORKFLOW ─────────────────────────────────── */}
        <PixelDoxaWorkflow />

        {/* ── FEATURES ─────────────────────────────────── */}
        <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(180 80% 45%) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(180 80% 45%) 1px, transparent 1px)
                `,
                backgroundSize: "32px 32px",
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
                <span className="text-accent">produção de assets</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ferramentas profissionais de criação, animação e exportação para desenvolvedores indie
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Wand2,
                  title: "Sprite Generation",
                  description: "Crie personagens únicos a partir de descrições textuais detalhadas",
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
                  description: "Partículas, efeitos de impacto e elementos visuais animados",
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

            {/* AI Panel + Workspace */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <AIGenerationPanel />
              <MainWorkspace />
            </div>
          </div>
        </section>

        {/* ── PIXEL ART SCENE ──────────────────────────── */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Assets em{" "}
                <span className="text-accent">tempo real</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Preview instantâneo de sprites, animações e elementos de cenário
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
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-accent/50 transition-all"
                >
                  <PixelSprite sprite={data.sprite} palette={data.palette} pixelSize={4} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCEDURAL GENERATOR ─────────────────────── */}
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

        {/* ── EXPORT CENTER ────────────────────────────── */}
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

        {/* ── COMMUNITY GALLERY ────────────────────────── */}
        <CommunityGallery />

        {/* ── PRICING ──────────────────────────────────── */}
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
                  features: ["50 gerações/mês", "Resolução até 64x64", "Formato PNG básico", "Comunidade"],
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
                    plan.popular
                      ? "border-accent shadow-lg shadow-accent/10"
                      : "border-border"
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
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                      plan.popular
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground glow-accent"
                        : "border border-border hover:border-accent/50 bg-transparent"
                    )}
                  >
                    {plan.cta}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] bg-accent/20 pointer-events-none" />
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
              Comece seu próximo projeto
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
              Pipeline profissional de pixel art para desenvolvedores indie que levam produção a sério.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold glow-accent group"
              >
                <Sparkles className="w-5 h-5" />
                Começar Agora — Grátis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border hover:border-accent/50 font-semibold transition-all"
              >
                Ver Documentação
              </motion.button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer className="border-t border-border py-12 px-4 bg-card/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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

              {[
                { title: "Produto",     links: ["Recursos", "Preços", "Changelog", "Roadmap"] },
                { title: "Recursos",    links: ["Documentação", "Tutoriais", "Blog", "API"] },
                { title: "Comunidade",  links: ["Discord", "Twitter", "GitHub", "Galeria"] },
                { title: "Legal",       links: ["Privacidade", "Termos", "Licença"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-semibold mb-4">{col.title}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="hover:text-foreground transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 PixelDoxa. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Feito com</span>
                <motion.span
                  className="text-accent"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ♥
                </motion.span>
                <span>para devs indie</span>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
