// CHEMIN : /components/menuPages/dossiers/DossierList.tsx

"use client";

import { Dossier } from "@/types";
import { DossierCard } from "@/components/menuPages/dossiers/DossierCard";
import { highlightText } from "@/components/utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

interface DossierListProps {
  dossiers: Dossier[];
  viewMode: "card" | "list";
  searchTerm: string;
}

export function DossierList({ dossiers, viewMode, searchTerm }: DossierListProps) {
  if (viewMode === "list") {
    return (
      // On utilise une div simple, pas de grille d'en-tête
      <div className="space-y-3">
        {dossiers.map((dossier) => (
          <Link 
            key={dossier.code}
            href={`/Espace-avocat/Dossier/${dossier.code}`}
            // Design de chaque ligne comme sur votre image
            className="group flex justify-between items-center bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-shadow duration-300 hover:shadow-md"
          >
            <div className="flex-grow">
              {/* 
                MODIFICATION PRINCIPALE :
                - text-gray-900 pour le noir que vous voyez
                - font-normal pour enlever le gras
              */}
              <h3 className="text-base font-normal text-gray-900 dark:text-gray-100">
                {highlightText(dossier.objet, searchTerm)}
              </h3>
              
              {/* Date de création, plus discrète */}
              <div className="mt-2 flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Créé le {dossier.createdAt ? format(new Date(dossier.createdAt), "dd MMMM yyyy", { locale: fr }) : "-"}
                  </span>
               </div>
            </div>

            {/* Chevron à droite */}
            <div className="ml-4">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        ))}
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
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
