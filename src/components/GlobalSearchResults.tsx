"use client";
import { useSearch } from "@/components/context/SearchContext";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Link from "next/link";
import { GlobalSearchResult } from "@/types";
import { ChevronRight } from "lucide-react"; // 🚀 Importation de l'icône ChevronRight

// Correction des erreurs de type dans la fonction utilitaire
function groupResultsByType(results: GlobalSearchResult[]) {
    const grouped: { [key: string]: GlobalSearchResult[] } = {
        avocat: [],
        decision: [],
        loi: [],
        article: [],
    };
    results.forEach((item) => {
        if (grouped[item.type]) {
            grouped[item.type].push(item);
        }
    });
    return grouped;
}

// Fonction pour obtenir le titre en français
function getCategoryTitle(type: string) {
  switch (type) {
    case 'avocat': return 'Avocats';
    case 'decision': return 'Décisions';
    case 'loi': return 'Lois';
    case 'article': return 'Articles de loi';
    default: return 'Autres résultats';
  }
}

export function GlobalSearchResults() {
    const { searchTerm, results, loading } = useSearch();

    if (!searchTerm) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Spinner variant="ring" size={48} />
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Aucun résultat trouvé pour &quot;{searchTerm}&quot;.
            </div>
        );
    }

    const groupedResults = groupResultsByType(results);
    const hasResults = Object.values(groupedResults).some(arr => arr.length > 0);

    if (!hasResults) {
        return (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                Aucun résultat trouvé pour &quot;{searchTerm}&quot;.
            </div>
        );
    }

    return (
        <div className="mt-4 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
                Résultats pour &quot;{searchTerm}&quot;
            </h3>
            {Object.keys(groupedResults).map((type) => {
                const categoryResults = groupedResults[type as keyof typeof groupedResults];
                if (categoryResults.length === 0) {
                    return null;
                }
                
                // 🚀 Limiter l'affichage à 3 résultats
                const limitedResults = categoryResults.slice(0, 3);
                const hasMoreResults = categoryResults.length > 3;

                return (
                    <div key={type} className="mb-6">
                        <h4 className="text-lg font-bold mb-2 text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                            {getCategoryTitle(type)} ({categoryResults.length})
                        </h4>
                        <ul className="space-y-3">
                            {limitedResults.map((item) => (
                                <li key={item.id} className="border-b dark:border-slate-700 pb-2 last:border-b-0">
                                    <Link href={`/${item.type}/${item.id}`} className="block hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md p-2 transition-colors">
                                        <p className="text-lg font-medium">{item.title}</p>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                            Type : {getCategoryTitle(item.type)}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* 🚀 Bouton "Voir plus" si plus de 3 résultats existent */}
                        {hasMoreResults && (
                            <div className="mt-2 text-right">
                                <Link 
                                    href={`/${type}`} 
                                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                                >
                                    Voir tous les {categoryResults.length} résultats <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}