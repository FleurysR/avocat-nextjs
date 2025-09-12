// src/components/menuPages/loi-articles/LoiArticleHeader.tsx

"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon, FileText, List } from "lucide-react"; // Supprimez LayoutGrid

interface LoiArticleHeaderProps {
  localSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // viewMode et onViewModeChange ne sont plus nécessaires
}

export function LoiArticleHeader({
  localSearch,
  onSearchChange,
}: LoiArticleHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 pb-6 border-b border-indigo-500 flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="bg-indigo-600 dark:bg-indigo-400 p-3 rounded-full">
          <FileText className="h-6 w-6 text-white dark:text-slate-900" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          Loi et Articles
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative flex items-center w-full sm:w-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un article..."
            value={localSearch}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-xl transition-shadow duration-200 shadow-md focus:shadow-lg"
          />
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
          {/* Supprimez le bouton pour la vue "card" */}
          <button
            onClick={() => {}} // Laissez une fonction vide si vous voulez garder le bouton "list" pour l'instant
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "bg-indigo-600 text-white shadow-md" // La vue par défaut est "list" maintenant
            )}
            aria-label="Vue par liste"
          >
            {/* <List className="h-5 w-5" /> */}
          </button>
        </div>
      </div>
    </header>
  );
}