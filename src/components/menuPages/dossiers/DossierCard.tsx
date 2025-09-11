// src/components/dossiers/DossierCard.tsx

"use client";

import { Dossier } from "@/types";
import { highlightText } from "@/components/utils/highlightText";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface DossierCardProps {
  dossier: Dossier;
  onSelect: () => void;
  searchTerm: string;
}

export function DossierCard({ dossier, onSelect, searchTerm }: DossierCardProps) {
  const displayObjet = dossier.objet;

  return (
    <li>
      <div
        onClick={onSelect}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <FileText className="h-6 w-6 text-indigo-500" />
          <Badge variant="secondary" className="font-medium">
            Code: {dossier.code || "-"}
          </Badge>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {highlightText(displayObjet, searchTerm)}
        </h2>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Créé le: {dossier.createdAt ? format(new Date(dossier.createdAt), "dd MMMM yyyy", { locale: fr }) : "-"}
        </div>
      </div>
    </li>
  );
}