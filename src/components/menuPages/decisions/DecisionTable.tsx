// src/components/decisions/DecisionTable.tsx
import { Decision } from "@/types";
import { highlightText } from "../../utils/highlightText";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DecisionTableProps {
  decisions: Decision[];
  onSelect: (code: string) => void;
  searchTerm: string;
}

export function DecisionTable({ decisions, onSelect, searchTerm }: DecisionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-slate-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">Objet</th>
            <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">Numéro Dossier</th>
            <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">Date</th>
            <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">Demandeur</th>
            <th scope="col" className="px-6 py-3 font-semibold text-gray-900 dark:text-gray-100">Défenseur</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr
              key={decision.code}
              onClick={() => onSelect(decision.code)}
              className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 max-w-xs line-clamp-2">
                {highlightText(decision.objet ?? '', searchTerm)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{decision.numeroDossier || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {decision.decisionAt ? format(new Date(decision.decisionAt), "dd/MM/yyyy", { locale: fr }) : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{decision.avocatDemandeur || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">{decision.avocatDefenseur || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}