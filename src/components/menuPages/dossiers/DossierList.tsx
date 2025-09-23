"use client";

import { Dossier } from "@/types";
import { DossierCard } from "@/components/menuPages/dossiers/DossierCard";
import { highlightText } from "@/components/utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";

interface DossierListProps {
  dossiers: Dossier[];
  viewMode: "card" | "list";
  searchTerm: string;
  onSelect?: (code: string) => void;
}

export function DossierList({ dossiers, viewMode, searchTerm, onSelect }: DossierListProps) {
  if (viewMode === "list") {
    // Mode liste moderne
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
        {/* En-tête de la liste */}
        <div className="hidden md:grid grid-cols-3 gap-6 px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="col-span-1">Code</div>
          <div className="col-span-1">Objet</div>
          <div className="col-span-1">Date de création</div>
        </div>

        {/* Corps de la liste */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {dossiers.map((dossier) => (
            <Link 
              key={dossier.code}
              href={`/Espace-avocat/Dossier/${dossier.code}`}
              className="group block px-4 py-4 md:py-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <div className="md:grid md:grid-cols-3 md:gap-6 items-center">
                {/* Cellule Code (sur une ligne à part sur mobile) */}
                <div className="flex items-center space-x-2 md:col-span-1 mb-2 md:mb-0">
                  <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-base font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    {dossier.code}
                  </span>
                </div>
                
                {/* Cellule Objet */}
                <div className="md:col-span-1 mb-2 md:mb-0">
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                    {highlightText(dossier.objet, searchTerm)}
                  </p>
                </div>

                {/* Cellule Date de création */}
                <div className="md:col-span-1">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {dossier.createdAt
                        ? format(new Date(dossier.createdAt), "dd MMM yyyy", { locale: fr })
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Mode carte (inchangé)
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dossiers.map((dossier) => (
        <li key={dossier.code}>
          <Link href={`/Espace-avocat/Dossier/${dossier.code}`}>
            <DossierCard
              dossier={dossier}
              searchTerm={searchTerm}
              onSelect={() => onSelect?.(dossier.code)}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}