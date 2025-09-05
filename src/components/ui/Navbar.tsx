"use client";

import { SearchIcon, Sun, Moon, MenuIcon, PanelLeftClose, PanelRightOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

interface NavbarProps {
  onToggle: () => void;
  isSidebarOpen: boolean;
  onSearch?: (term: string) => void;
}

export function Navbar({ onToggle, isSidebarOpen, onSearch }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Mode ${newTheme === "dark" ? "sombre" : "clair"} activé !`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">

        {/* Sidebar / Menu mobile */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-r dark:border-gray-700 bg-slate-100 dark:bg-slate-900 p-4">
              <nav className="flex flex-col space-y-4">
                <a href="/Espace-avocat" className="hover:text-gray-700 dark:hover:text-white/80">Accueil</a>
                <a href="/Espace-avocat/dossiers" className="hover:text-gray-700 dark:hover:text-white/80">Mes dossiers</a>
                <a href="/Espace-avocat/decision" className="hover:text-gray-700 dark:hover:text-white/80">Décision</a>
              </nav>
              <div className="flex items-center space-x-2 mt-auto pt-6">
                <Label htmlFor="dark-mode-mobile" className="text-sm">Mode sombre</Label>
                <Switch
                  id="dark-mode-mobile"
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon" onClick={onToggle} className="w-10 h-10 rounded-full">
              {isSidebarOpen ? <PanelLeftClose /> : <PanelRightOpen />}
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 w-full rounded-full bg-gray-200/50 dark:bg-gray-800/50"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Contrôles thème */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="dark-mode-desktop" className="hidden md:flex text-sm">Mode sombre</Label>
          <Switch
            id="dark-mode-desktop"
            checked={theme === "dark"}
            onCheckedChange={handleThemeChange}
          />
          <Button variant="ghost" size="icon" onClick={handleThemeChange}>
            {theme === "dark" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </header>
  );
}
