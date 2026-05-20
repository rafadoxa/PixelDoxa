// PixelDoxa — Internationalization
// Idiomas: EN (default / international) | PT (Português Brasil)

export type Language = "en" | "pt"

export const translations = {
  en: {
    // ── Navbar ──────────────────────────────────────────────
    nav: {
      features: "Features",
      gallery:  "Gallery",
      docs:     "Docs",
      pricing:  "Pricing",
      search:   "Search sprites, tilesets, characters...",
      tryFree:  "Try Free",
      openApp:  "Open App",
    },

    // ── Hero ────────────────────────────────────────────────
    hero: {
      badge:        "Professional Pixel Art Pipeline",
      badgeSub:     "Studio",
      tagline:      "Game-Ready",
      headline1:    "Assets",
      headline2:    "Pixel Art",
      headline3:    "Pipeline",
      subtitle:     "Generate, animate and export pixel art sprites, tilesets and spritesheets — game-ready for",
      compatEnd:    "and more.",
      pills: {
        export:    "Export Game-Ready",
        animation: "Animation Pipeline",
        tileset:   "Tileset Workflow",
      },
      compatLabel: "Compatible with",
      generating:  "Generating Spritesheet",
      stats: {
        assets:     "Exported Assets",
        devs:       "Developers",
        projects:   "Active Projects",
        rating:     "Rating",
      },
      cta:        "Start Free",
      ctaSub:     "View Demo",
    },

    // ── Features Section ────────────────────────────────────
    features: {
      badge:    "Professional Tools",
      title1:   "Complete",
      titleAcc: "asset production",
      title2:   "pipeline",
      subtitle: "Professional creation, animation and export tools for indie developers",
      cards: {
        sprite:    { title: "Sprite Generation",    desc: "Create unique characters from detailed text descriptions" },
        animation: { title: "Animation Pipeline",   desc: "Walk cycles, attacks, idle and complete states in one workflow" },
        tileset:   { title: "Tileset Workflow",      desc: "Seamless tilesets for level design with integrated auto-tiling" },
        engine:    { title: "Engine Integration",    desc: "Export to Godot, Unity, GameMaker with native formats" },
        vfx:       { title: "VFX Assets",            desc: "Particles, impact effects and animated visual elements" },
        npc:       { title: "NPC Library",           desc: "Enemies, NPCs and creatures with complete spritesheets" },
      },
    },

    // ── Realtime Assets Section ──────────────────────────────
    realtime: {
      title:    "Assets in",
      titleAcc: "real time",
      subtitle: "Instant preview of sprites, animations and scene elements",
    },

    // ── Procedural Generator Section ────────────────────────
    procedural: {
      badge:    "Wave Function Collapse",
      title:    "Procedural",
      titleAcc: "World",
      title2:   "Generation",
      subtitle: "Create dungeons, forests, villages and much more with advanced algorithms",
    },

    // ── Export Section ───────────────────────────────────────
    export: {
      title:    "Export to your",
      titleAcc: "favorite engine",
      subtitle: "Compatible with Godot, Unity, GameMaker, RPG Maker and more",
    },

    // ── Community Gallery ────────────────────────────────────
    gallery: {
      badge:       "Community",
      title:       "Made by",
      titleAcc:    "the community",
      subtitle:    "Professional spritesheets made by the community. Production-ready assets with complete animations and direct export.",
      search:      "Search sprites, tilesets...",
      categories:  ["All", "Featured", "Characters", "Tilesets", "Spritesheets", "Environment"],
      tags: {
        Character:  "Character",
        Animation:  "Animation",
        Medieval:   "Medieval",
        Fantasy:    "Fantasy",
        Featured:   "Featured",
      },
      stats: {
        sprites:  "Premium Sprites",
        artists:  "Active Artists",
      },
    },

    // ── Pricing ─────────────────────────────────────────────
    pricing: {
      title:    "Choose your",
      titleAcc: "plan",
      subtitle: "Start free, upgrade when you need",
      popular:  "Most Popular",
      period:   "/mo",
      plans: {
        free: {
          name:        "Free",
          price:       "$0",
          description: "Perfect to get started",
          features:    ["50 generations/mo", "Up to 64×64 resolution", "Basic PNG export", "Community access"],
          cta:         "Get Started Free",
        },
        pro: {
          name:        "Pro",
          price:       "$9",
          description: "For indie developers",
          features:    ["Unlimited generations", "Up to 256×256", "All export formats", "Spritesheets", "Animations", "No watermark"],
          cta:         "Start Pro",
        },
        studio: {
          name:        "Studio",
          price:       "$29",
          description: "For teams",
          features:    ["Everything in Pro", "5 team members", "API access", "Priority queue", "Exclusive assets", "Dedicated support"],
          cta:         "Contact Sales",
        },
      },
    },

    // ── CTA Section ──────────────────────────────────────────
    cta: {
      title:   "Start your next project",
      subtitle: "Professional pixel art pipeline for indie developers who take production seriously.",
      primary:  "Start Now — Free",
      secondary: "View Docs",
    },

    // ── Footer ───────────────────────────────────────────────
    footer: {
      tagline:   "Professional pixel art pipeline for indie developers.",
      columns: {
        product:   "Product",
        resources: "Resources",
        community: "Community",
        legal:     "Legal",
      },
      links: {
        product:   ["Features", "Pricing", "Changelog", "Roadmap"],
        resources: ["Documentation", "Tutorials", "Blog", "API"],
        community: ["Discord", "Twitter", "GitHub", "Gallery"],
        legal:     ["Privacy", "Terms", "License"],
      },
      copyright: "© 2026 PixelDoxa. All rights reserved.",
      madeWith:  "Made with",
      madeFor:   "for indie devs",
    },

    // ── Animation Pipeline Component ─────────────────────────
    animationPipeline: {
      badge:       "Professional",
      subtitle:    "Complete pipeline to create game-ready animated spritesheets.",
    },

    // ── Video Showcase Component ─────────────────────────────
    videoShowcase: {
      badge:       "Professional",
    },

    // ── Sidebar ──────────────────────────────────────────────
    sidebar: {
      tools: [
        "Character Generator",
        "SpriteSheet Generator",
        "Tileset Generator",
        "Pixel Editor",
        "Procedural Map Generator",
        "Export Center",
        "Community",
      ],
      upgradeBadge: "Upgrade to Pro",
      upgradeDesc:  "Unlimited generations + Spritesheets",
    },

    // ── Pixeldoxa Workflow Component ────────────────────────
    workflow: {
      readyVariations: "4 ready variations",
      readyAssets:     "animations and worlds ready for your game",
    },
  },

  // ════════════════════════════════════════════════════════════
  pt: {
    // ── Navbar ──────────────────────────────────────────────
    nav: {
      features: "Recursos",
      gallery:  "Galeria",
      docs:     "Docs",
      pricing:  "Preços",
      search:   "Buscar sprites, tilesets, personagens...",
      tryFree:  "Experimentar",
      openApp:  "Abrir App",
    },

    // ── Hero ────────────────────────────────────────────────
    hero: {
      badge:        "Pipeline Profissional de Pixel Art",
      badgeSub:     "Studio",
      tagline:      "Prontos para o Jogo",
      headline1:    "Assets",
      headline2:    "Pixel Art",
      headline3:    "Pipeline",
      subtitle:     "Gere, anime e exporte sprites, tilesets e spritesheets de pixel art — prontos para",
      compatEnd:    "e mais.",
      pills: {
        export:    "Exportar Pronto para Jogo",
        animation: "Pipeline de Animação",
        tileset:   "Workflow de Tileset",
      },
      compatLabel: "Compatível com",
      generating:  "Gerando Spritesheet",
      stats: {
        assets:   "Assets Exportados",
        devs:     "Desenvolvedores",
        projects: "Projetos Ativos",
        rating:   "Avaliação",
      },
      cta:    "Começar Grátis",
      ctaSub: "Ver Demo",
    },

    // ── Features Section ────────────────────────────────────
    features: {
      badge:    "Ferramentas Profissionais",
      title1:   "Pipeline completo de",
      titleAcc: "produção de assets",
      title2:   "",
      subtitle: "Ferramentas profissionais de criação, animação e exportação para desenvolvedores indie",
      cards: {
        sprite:    { title: "Geração de Sprites",    desc: "Crie personagens únicos a partir de descrições textuais detalhadas" },
        animation: { title: "Pipeline de Animação",  desc: "Walk cycles, ataques, idle e estados completos em um workflow" },
        tileset:   { title: "Workflow de Tileset",    desc: "Tilesets seamless para level design com auto-tiling integrado" },
        engine:    { title: "Integração de Engines",  desc: "Exporte para Godot, Unity, GameMaker com formatos nativos" },
        vfx:       { title: "Assets VFX",             desc: "Partículas, efeitos de impacto e elementos visuais animados" },
        npc:       { title: "Biblioteca de NPCs",      desc: "Inimigos, NPCs e criaturas com spritesheets completos" },
      },
    },

    // ── Realtime Assets Section ──────────────────────────────
    realtime: {
      title:    "Assets em",
      titleAcc: "tempo real",
      subtitle: "Preview instantâneo de sprites, animações e elementos de cenário",
    },

    // ── Procedural Generator Section ────────────────────────
    procedural: {
      badge:    "Wave Function Collapse",
      title:    "Geração",
      titleAcc: "Procedural",
      title2:   "de Mundos",
      subtitle: "Crie dungeons, florestas, vilas e muito mais com algoritmos avançados",
    },

    // ── Export Section ───────────────────────────────────────
    export: {
      title:    "Exporte para sua",
      titleAcc: "engine favorita",
      subtitle: "Compatível com Godot, Unity, GameMaker, RPG Maker e mais",
    },

    // ── Community Gallery ────────────────────────────────────
    gallery: {
      badge:       "Comunidade",
      title:       "Feito pela",
      titleAcc:    "comunidade",
      subtitle:    "Spritesheets profissionais criados pela comunidade. Assets prontos para produção com animações completas e exportação direta.",
      search:      "Buscar sprites, tilesets...",
      categories:  ["Todos", "Em Destaque", "Personagens", "Tilesets", "Spritesheets", "Ambiente"],
      tags: {
        Character: "Personagem",
        Animation: "Animação",
        Medieval:  "Medieval",
        Fantasy:   "Fantasy",
        Featured:  "Destaque",
      },
      stats: {
        sprites: "Sprites Premium",
        artists: "Artistas Ativos",
      },
    },

    // ── Pricing ─────────────────────────────────────────────
    pricing: {
      title:    "Escolha seu",
      titleAcc: "plano",
      subtitle: "Comece grátis, faça upgrade quando precisar",
      popular:  "Mais Popular",
      period:   "/mês",
      plans: {
        free: {
          name:        "Free",
          price:       "R$0",
          description: "Para experimentar",
          features:    ["50 gerações/mês", "Resolução até 64×64", "Formatos PNG básico", "Comunidade"],
          cta:         "Começar Grátis",
        },
        pro: {
          name:        "Pro",
          price:       "R$49",
          description: "Para desenvolvedores indie",
          features:    ["Gerações ilimitadas", "Até 256×256", "Todos os formatos", "Spritesheets", "Animações", "Sem marca d'água"],
          cta:         "Começar Pro",
        },
        studio: {
          name:        "Studio",
          price:       "R$149",
          description: "Para times",
          features:    ["Tudo do Pro", "5 membros", "API access", "Prioridade", "Assets exclusivos", "Suporte dedicado"],
          cta:         "Contatar Vendas",
        },
      },
    },

    // ── CTA Section ──────────────────────────────────────────
    cta: {
      title:     "Comece seu próximo projeto",
      subtitle:  "Pipeline profissional de pixel art para desenvolvedores indie que levam produção a sério.",
      primary:   "Começar Agora — Grátis",
      secondary: "Ver Documentação",
    },

    // ── Footer ───────────────────────────────────────────────
    footer: {
      tagline:   "Pipeline profissional de pixel art para desenvolvedores indie.",
      columns: {
        product:   "Produto",
        resources: "Recursos",
        community: "Comunidade",
        legal:     "Legal",
      },
      links: {
        product:   ["Recursos", "Preços", "Changelog", "Roadmap"],
        resources: ["Documentação", "Tutoriais", "Blog", "API"],
        community: ["Discord", "Twitter", "GitHub", "Galeria"],
        legal:     ["Privacidade", "Termos", "Licença"],
      },
      copyright: "© 2026 PixelDoxa. Todos os direitos reservados.",
      madeWith:  "Feito com",
      madeFor:   "para devs indie",
    },

    // ── Animation Pipeline Component ─────────────────────────
    animationPipeline: {
      badge:    "Profissional",
      subtitle: "Pipeline completo para criar spritesheets animados game-ready.",
    },

    // ── Video Showcase Component ─────────────────────────────
    videoShowcase: {
      badge: "Profissional",
    },

    // ── Sidebar ──────────────────────────────────────────────
    sidebar: {
      tools: [
        "Gerador de Personagens",
        "Gerador de SpriteSheet",
        "Gerador de Tileset",
        "Editor de Pixel",
        "Gerador Procedural de Mapas",
        "Centro de Exportação",
        "Comunidade",
      ],
      upgradeBadge: "Upgrade para Pro",
      upgradeDesc:  "Gerações ilimitadas + Spritesheets",
    },

    // ── Pixeldoxa Workflow Component ────────────────────────
    workflow: {
      readyVariations: "4 variações prontas",
      readyAssets:     "animações e mundos prontos para seu jogo",
    },
  },
} as const

export type Translations = typeof translations["en"]
