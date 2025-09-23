// src/components/DecisionTable.tsx
"use client";

import { Decision } from "@/types";
import { highlightText } from "../../utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Importez les composants de shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DecisionTableProps {
  decisions: Decision[];
  onSelect: (code: string) => void;
  searchTerm: string;
}

export function DecisionTable({ decisions, onSelect, searchTerm }: DecisionTableProps) {
  return (
    // Le conteneur donne un effet de "carte" avec des coins arrondis et une bordure
    <div className="rounded-xl border shadow-lg overflow-hidden">
      <Table>
        {/* En-tête du tableau - Style plus pro avec les couleurs de shadcn/ui */}
        <TableHeader className="bg-gray-50 dark:bg-slate-800">
          <TableRow>
            <TableHead className="w-[300px] font-bold text-gray-900 dark:text-gray-100">Objet</TableHead>
            <TableHead className="w-[150px] font-bold text-gray-900 dark:text-gray-100">Numéro Dossier</TableHead>
            <TableHead className="w-[120px] font-bold text-gray-900 dark:text-gray-100">Date</TableHead>
            <TableHead className="font-bold text-gray-900 dark:text-gray-100">Demandeur</TableHead>
            <TableHead className="font-bold text-gray-900 dark:text-gray-100">Défenseur</TableHead>
          </TableRow>
        </TableHeader>

        {/* Corps du tableau */}
        <TableBody>
          {decisions.map((decision) => (
            <TableRow
              key={decision.code}
              onClick={() => onSelect(decision.code)}
              className="cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
            >
              {/* Cellule "Objet" avec la mise en surbrillance de la recherche */}
              <TableCell className="font-medium max-w-xs line-clamp-2">
                {highlightText(decision.objet ?? '', searchTerm)}
              </TableCell>

              {/* Cellules restantes */}
              <TableCell>{decision.numeroDossier || "-"}</TableCell>
              <TableCell>
                {decision.decisionAt ? format(new Date(decision.decisionAt), "dd/MM/yyyy", { locale: fr }) : "-"}
              </TableCell>
              <TableCell>{decision.avocatDemandeur || "-"}</TableCell>
              <TableCell>{decision.avocatDefendeur || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}