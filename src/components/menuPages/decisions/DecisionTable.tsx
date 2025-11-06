// src/components/decisions/DecisionTable.tsx

import { Decision } from "@/types";
import { highlightText } from "../../utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DecisionTableProps {
  decisions: Decision[];
  onSelect: (code: string) => void;
  searchTerm: string;
}

export function DecisionTable({ decisions, onSelect, searchTerm }: DecisionTableProps) {
  return (
    <div className="rounded-xl border shadow-md overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100 dark:bg-slate-900">
          <TableRow>
            <TableHead className="w-[400px] font-semibold text-gray-900 dark:text-gray-100 py-4">
              Objet
            </TableHead>
            <TableHead className="w-[150px] font-semibold text-gray-900 dark:text-gray-100 py-4">
              Numéro Dossier
            </TableHead>
            <TableHead className="w-[120px] font-semibold text-gray-900 dark:text-gray-100 py-4">
              Date
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
              Demandeur
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
              Défenseur
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100 py-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {decisions.map((decision, index) => (
            <TableRow
              key={decision.code}
              // MODIFIÉ : Application des lignes zébrées (Gris Brume)
              className={`transition-colors cursor-pointer 
                ${index % 2 === 0 ? 'bg-secondary dark:bg-slate-800' : 'bg-white dark:bg-slate-900'} 
                hover:bg-gray-100 dark:hover:bg-slate-700/50`}
            >
              <TableCell className="font-medium max-w-xs line-clamp-2 py-4">
                {highlightText(decision.objet ?? "", searchTerm)}
              </TableCell>
              <TableCell className="py-4">{decision.numeroDossier || "-"}</TableCell>
              <TableCell className="py-4">
                {decision.decisionAt
                  ? format(new Date(decision.decisionAt), "dd/MM/yyyy", { locale: fr })
                  : "-"}
              </TableCell>
              <TableCell className="py-4">{decision.avocatDemandeur || "-"}</TableCell>
              <TableCell className="py-4">{decision.avocatDefendeur || "-"}</TableCell>

              {/* Colonne Actions */}
              <TableCell className="flex justify-center gap-2 py-4">
                {/* MODIFIÉ : 'Voir' en Bleu Royal */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelect(decision.code)}
                >
                  <Eye className="h-4 w-4 text-sidebar-primary" />
                </Button>
                {/* MODIFIÉ : 'Modifier' en Vert Vif */}
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4 text-chart-1" />
                </Button>
                {/* Conservé : 'Supprimer' en Rouge (conventionnel) */}
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}