// CHEMIN : /components/menuPages/dossiers/DossiersHeader.tsx

"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, FilePlus, Briefcase, List, LayoutGrid } from "lucide-react"; // Remplacé FileText par Briefcase

interface DossiersHeaderProps {
  localSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: "card" | "list";
  onViewModeChange: (mode: "card" | "list") => void;
  totalItems: number; // Gardé pour info, même si non affiché ici
}

export function DossiersHeader({
  localSearch,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: DossiersHeaderProps) {
  return (
    // Retour à la structure originale sur une seule ligne
    <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
      
      {/* Titre */}
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
          <Briefcase className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200"> 
          Mes Dossiers
        </h1>
      </div>

      {/* Controles à droite */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un dossier..."
            value={localSearch}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 text-base bg-white dark:bg-gray-800 rounded-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          <button
            onClick={() => onViewModeChange("list")}
            className={cn("p-2 rounded-full transition-colors duration-200", viewMode === "list" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow" : "text-gray-500 hover:text-indigo-600")}
            aria-label="Vue par liste"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            className={cn("p-2 rounded-full transition-colors duration-200", viewMode === "card" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow" : "text-gray-500 hover:text-indigo-600")}
            aria-label="Vue par cartes"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
        <Link href="/Espace-avocat/Dossier/AddDossierForm">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 font-semibold">
            <FilePlus className="h-5 w-5" />
            Créer
          </button>
        </Link>
      </div>
    </header>
  );
}
