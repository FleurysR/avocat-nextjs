// src/components/decisions/DecisionCard.tsx
import { Decision } from "@/types";
import { highlightText } from "../../utils/highlightText";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DecisionCardProps {
  decision: Decision;
  onSelect: () => void;
  searchTerm: string;
}

export function DecisionCard({ decision, onSelect, searchTerm }: DecisionCardProps) {
  const objet = decision.objet || "Sans objet";

  return (
    <li>
      <div
        onClick={onSelect}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 p-6 
                   hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer 
                   flex flex-col h-full"
      >
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2 line-clamp-2">
          {highlightText(objet, searchTerm)}
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
            Dossier n°: {decision.numeroDossier || "-"}
          </Badge>
          <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
            Date: {decision.decisionAt ? format(new Date(decision.decisionAt), "dd/MM/yyyy", { locale: fr }) : "-"}
          </Badge>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium w-32">Demandeur:</span>
            <span className="truncate flex-1">{decision.avocatDemandeur || "-"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium w-32">Défenseur:</span>
            <span className="truncate flex-1">{decision.avocatDefenseur || "-"}</span>
          </div>
        </div>
      </div>
    </li>
  );
}