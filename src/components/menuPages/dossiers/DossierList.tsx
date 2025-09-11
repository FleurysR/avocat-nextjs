// src/components/dossiers/DossierList.tsx

"use client";

import { Dossier } from "@/types";
import { DossierCard } from "@/components/menuPages/dossiers/DossierCard";
import { highlightText } from "@/components/utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DossierListProps {
  dossiers: Dossier[];
  viewMode: "card" | "list";
  onSelect: (code: string) => void;
  searchTerm: string;
}

export function DossierList({ dossiers, viewMode, onSelect, searchTerm }: DossierListProps) {
  if (viewMode === "list") {
    // Rendu en mode 'liste' (tableau)
    return (
      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Objet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date de création
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
            {dossiers.map((dossier) => (
              <tr 
                key={dossier.code} 
                onClick={() => onSelect(dossier.code)} 
                className="hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {dossier.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {highlightText(dossier.objet, searchTerm)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {dossier.createdAt ? format(new Date(dossier.createdAt), "dd MMMM yyyy", { locale: fr }) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Rendu en mode 'carte' (par défaut)
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dossiers.map((dossier) => (
        <DossierCard
          key={dossier.code}
          dossier={dossier}
          onSelect={() => onSelect(dossier.code)}
          searchTerm={searchTerm}
        />
      ))}
    </ul>
  );
}