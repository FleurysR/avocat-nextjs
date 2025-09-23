// src/components/ui/Navbar.tsx
"use client";

import {
  SearchIcon,
  Sun,
  Moon,
  MenuIcon,
  PanelLeftClose,
  PanelRightOpen,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
// 🚀 Chemin d'importation corrigé
import { SearchInput } from "../context/SearchInput"; 

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
}

export function Navbar({ onToggle, isSidebarOpen }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    try {
      setTheme(newTheme);
      toast.success(`Mode ${newTheme === "dark" ? "sombre" : "clair"} activé !`);
    } catch (error) {
      toast.error("Échec du changement de thème. Veuillez réessayer.");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900 backdrop-blur-lg text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Sidebar / Menu mobile */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 border-r border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900 p-4"
            >
              <nav className="flex flex-col space-y-4">
                <a
                  href="/Espace-avocat"
                  className="hover:text-gray-700 dark:hover:text-white/80 text-gray-700 dark:text-gray-300"
                >
                  Accueil
                </a>
                <a
                  href="/Espace-avocat/dossiers"
                  className="hover:text-gray-700 dark:hover:text-white/80 text-gray-700 dark:text-gray-300"
                >
                  Mes dossiers
                </a>
                <a
                  href="/Espace-avocat/decision"
                  className="hover:text-gray-700 dark:hover:text-white/80 text-gray-700 dark:text-gray-300"
                >
                  Décision
                </a>
              </nav>
              <div className="flex items-center space-x-2 mt-auto pt-6">
                <Label htmlFor="dark-mode-mobile" className="text-sm text-gray-700 dark:text-gray-300">
                  Mode sombre
                </Label>
                <Switch
                  id="dark-mode-mobile"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-10 h-10 rounded-full text-gray-500 dark:text-gray-300"
            >
              {isSidebarOpen ? <PanelLeftClose /> : <PanelRightOpen />}
            </Button>
          </div>
        </div>

        {/* Barre de recherche globale (simplifiée) */}
        <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
          <SearchInput
            placeholder="Rechercher avocat, loi, article ou décision..."
            className="w-full"
          />
        </div>

        {/* Contrôles thème */}
        <div className="flex items-center space-x-4">
          <Label
            htmlFor="dark-mode-desktop"
            className="hidden md:flex text-sm text-gray-700 dark:text-gray-300"
          >
            Mode sombre
          </Label>
          <Switch
            id="dark-mode-desktop"
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
          />
          <Button variant="ghost" size="icon" onClick={() => handleThemeChange(theme !== "dark")} className="text-gray-500 dark:text-gray-300">
            {theme === "dark" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </header>
  );
}