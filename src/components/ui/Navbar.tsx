"use client";

import { SearchIcon, Sun, Moon, MenuIcon, PanelLeftClose, PanelRightOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
}

export function Navbar({ onToggle, isSidebarOpen }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          {/* L'espace pour le logo est vide */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8"> {/* Conteneur principal avec padding */}
        
        {/* Partie gauche : Bouton de bascule du sidebar et menu mobile */}
        <div className="flex items-center space-x-4">
          {/* Bouton pour le menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-r border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
              <nav className="flex flex-col space-y-4">
                <a href="/Espace-avocat" className="text-lg font-semibold hover:text-gray-700 dark:hover:text-white/80 transition-colors">Accueil</a>
                <a href="/Espace-avocat/dossiers" className="text-lg font-semibold hover:text-gray-700 dark:hover:text-white/80 transition-colors">Mes dossiers</a>
                <a href="/Espace-avocat/decision" className="text-lg font-semibold hover:text-gray-700 dark:hover:text-white/80 transition-colors">Décision</a>
              </nav>
              <div className="flex items-center space-x-2 mt-auto pt-6">
                <Label htmlFor="dark-mode-mobile" className="text-sm">Mode sombre</Label>
                <Switch
                  id="dark-mode-mobile"
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Bouton de bascule du sidebar (désormais à l'extérieur de la barre principale) */}
          <div className="hidden md:flex items-center transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              onClick={onToggle}
              className="w-10 h-10 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              ) : (
                <PanelRightOpen className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              )}
            </Button>
          </div>
        </div>

        {/* Partie centrale : Barre de recherche */}
        <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input type="search" placeholder="Rechercher..." className="pl-10 w-full bg-gray-200/50 text-gray-900 dark:bg-gray-800/50 dark:text-gray-100 border border-transparent rounded-full focus:ring-2 focus:ring-blue-500 transition-colors" />
            </div>
        </div>

        {/* Partie droite : Contrôles (thème) */}
        <div className="flex items-center space-x-4">
            {/* Interrupteur de thème pour les écrans larges */}
            <div className="hidden md:flex items-center space-x-2">
                <Label htmlFor="dark-mode-desktop" className="text-sm">Mode sombre</Label>
                <Switch
                    id="dark-mode-desktop"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
            </div>

            {/* Bouton de bascule de thème */}
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {mounted && (theme === "dark" ? <Moon className="h-6 w-6 text-gray-100" /> : <Sun className="h-6 w-6 text-gray-900" />)}
            </Button>
        </div>

      </div>
    </header>
  );
}