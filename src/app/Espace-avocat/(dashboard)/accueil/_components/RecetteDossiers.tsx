// app/Espace-avocat/(dashboard)/accueil/_components/RecetteDossiers.tsx
import { BookOpen } from "lucide-react";

interface RecetteDossier {
  code: string;
  titre: string;
  description: string;
}

const recettes: RecetteDossier[] = [
  {
    code: "R-001",
    titre: "Recette Agence Immobilière",
    description: "Guide pour la gestion immobilière efficace.",
  },
  {
    code: "R-002",
    titre: "Recette Divorce à l’Amiable",
    description: "Étapes clés et documents requis.",
  },
  {
    code: "R-003",
    titre: "Recette Constitution de Société",
    description: "Checklist de création de société en SARL.",
  },
];

export const RecetteDossiers = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-indigo-500" />
      Recettes Juridiques
    </h3>
    <ul className="space-y-3">
      {recettes.map(recette => (
        <li key={recette.code} className="p-3 rounded-lg bg-slate-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition">
          <div className="font-medium text-gray-800 dark:text-gray-200">{recette.titre}</div>
          <div className="text-xs text-gray-500 mb-1">{recette.code}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{recette.description}</div>
        </li>
      ))}
    </ul>
  </div>
);
