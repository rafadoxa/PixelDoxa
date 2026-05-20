"use client"

import { motion } from "framer-motion"
import { Menu, Moon, Sun, Search, Bell, Sparkles, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

interface TopNavbarProps {
  onMenuClick: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  onOpenApp?: () => void
}

export function TopNavbar({ onMenuClick, isDarkMode, toggleDarkMode, onOpenApp }: TopNavbarProps) {
  const { lang, setLang, t } = useLanguage()

  const navLinks = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.gallery,  href: "#gallery"  },
    { label: t.nav.docs,     href: "#"          },
    { label: t.nav.pricing,  href: "#pricing"   },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-16 glass border-b border-border z-50 flex items-center justify-between px-4"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ixel%20%281%29-i4KJfGtEB6A47vkISBmW0KT37cQoye.png"
            alt="PixelDoxa Logo"
            className="h-10 w-auto"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-medium rounded-full border border-accent/30">
              BETA
            </span>
          </div>
        </motion.a>

        {/* Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              whileHover={{ y: -1 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.nav.search}
            className="pl-10 pr-16 bg-secondary/50 border-border focus:bg-secondary focus:border-accent/50 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-background/80 border border-border rounded text-[10px]">
              <Command className="w-3 h-3" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">

        {/* ── Language Toggle ── */}
        <div className="flex items-center gap-0.5 bg-secondary/60 rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setLang("en")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
              lang === "en"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-sm">🇺🇸</span>
            <span className="hidden sm:inline">EN</span>
          </button>
          <button
            onClick={() => setLang("pt")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
              lang === "pt"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-sm">🇧🇷</span>
            <span className="hidden sm:inline">PT</span>
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-px">
                  {[1,2,1,2,3,2,1,2,1].map((c, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5"
                      style={{ backgroundColor: c === 1 ? 'transparent' : c === 2 ? '#4ecdc4' : '#7bc97b' }}
                    />
                  ))}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>My Profile</DropdownMenuItem>
            <DropdownMenuItem>My Projects</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onOpenApp && (
          <Button
            onClick={onOpenApp}
            variant="outline"
            className="hidden sm:flex border-accent/50 text-accent hover:bg-accent/10 gap-2"
          >
            {lang === "pt" ? "Abrir App" : "Open App"}
          </Button>
        )}
        <Button className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground glow-accent gap-2">
          <Sparkles className="w-4 h-4" />
          {lang === "pt" ? "Upgrade Pro" : "Upgrade Pro"}
        </Button>
      </div>
    </motion.header>
  )
}
