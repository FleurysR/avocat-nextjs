// src/components/menuPages/avocats/AvocatsGrid.tsx

import { Avocat } from "@/types";
import { AvocatCardItem } from "./AvocatCard";
import { AvocatListItem } from "./AvocatListItem";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvocatsGridProps {
  avocats: Avocat[];
  searchTerm: string;
  onAvocatClick: (code: string) => void;
  viewMode: "card" | "list";
  // NOUVELLES PROPS POUR UN TRI PLUS FLEXIBLE
  sortField: "nom" | "ville" | null;
  sortOrder: "asc" | "desc" | null;
  onSortChange: (field: "nom" | "ville") => void;
}

export function AvocatsGrid({ avocats, searchTerm, onAvocatClick, viewMode, sortField, sortOrder, onSortChange }: AvocatsGridProps) {
  if (avocats.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center p-6">Aucun avocat trouvé.</p>
    );
  }

  // Fonction utilitaire pour le rendu des en-têtes de tri
  const renderSortHeader = (field: "nom" | "ville", label: string) => (
    <button onClick={() => onSortChange(field)} className="flex items-center gap-1.5 transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">
      {label}
      <div className="flex flex-col">
        <ArrowUp className={cn("h-3 w-3 transition-opacity duration-200 -mb-1", sortField === field && sortOrder === "asc" ? "opacity-100 text-indigo-600 dark:text-indigo-400" : "opacity-30")} />
        <ArrowDown className={cn("h-3 w-3 transition-opacity duration-200", sortField === field && sortOrder === "desc" ? "opacity-100 text-indigo-600 dark:text-indigo-400" : "opacity-30")} />
      </div>
    </button>
  );

  // Rendu de la vue en tableau
  if (viewMode === "list") {
    return (
      <div className="w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-950">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {renderSortHeader("nom", "Nom")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Téléphone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {renderSortHeader("ville", "Ville")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  District
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {avocats.map((avocat) => (
                <AvocatListItem
                  key={avocat.code}
                  avocat={avocat}
                  searchTerm={searchTerm}
                  onClick={onAvocatClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Rendu de la vue en grille de cartes
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {avocats.map((avocat) => (
        <AvocatCardItem
          key={avocat.code}
          avocat={avocat}
          searchTerm={searchTerm}
          onClick={onAvocatClick}
        />
      ))}
    </div>
  );
}