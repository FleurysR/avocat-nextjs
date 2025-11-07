// src/components/GlobalSearchResults.tsx

"use client";

import { AlertTriangle, Search, FileText, Scale, Gavel } from 'lucide-react';
import { useGlobalSearch } from '@/components/context/GlobalSearchContext'; 
import { useDebounce } from '@/components/context/useDebounce'; 
import { useState, useEffect, useMemo } from 'react'; // 💡 AJOUT DE useMemo
import { globalSearch } from '@/services/client-api'; 

// --- Définitions de types pour la recherche globale ---
type ResultType = 'avocat' | 'article' | 'decision';

interface SearchResult {
    type: ResultType;
    title: string;
    details: any; 
    id: string;
}

// 💡 NOUVEAU TYPE pour les résultats regroupés
interface GroupedResults {
    [key: string]: {
        count: number;
        items: SearchResult[];
        icon: React.ElementType;
        label: string;
    };
}

// --- Composant Principal ---
export function GlobalSearchResults() {
  
  const { globalSearch: globalSearchTerm } = useGlobalSearch(); 
  const debouncedSearchTerm = useDebounce(globalSearchTerm, 500);

  const [results, setResults] = useState<SearchResult[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logique de recherche (invariante)
  useEffect(() => {
    if (!debouncedSearchTerm) { 
      setResults([]);
      return;
    }

    const fetchGlobalResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiResults = await globalSearch(debouncedSearchTerm);
        setResults(apiResults as SearchResult[]); 
      } catch (err) {
        console.error("Erreur lors de la recherche globale (Service):", err);
        setError("Échec du chargement des résultats de recherche. Veuillez vérifier le service API.");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalResults();
  }, [debouncedSearchTerm]);


  // 🚀 NOUVEAU : Fonction de regroupement des résultats et de calcul des totaux
  const groupedAndCountedResults: GroupedResults = useMemo(() => {
    
    // Définition de base avec les métadonnées (icônes et labels)
    const initialGroups: GroupedResults = {
      avocat: { count: 0, items: [], icon: Gavel, label: "Avocats" },
      decision: { count: 0, items: [], icon: FileText, label: "Décisions" },
      article: { count: 0, items: [], icon: Scale, label: "Articles de loi" },
    };

    return results.reduce((acc, result) => {
      const type = result.type;
      
      // Assurez-vous que le type est valide
      if (acc[type]) {
        acc[type].count += 1;
        acc[type].items.push(result);
      }
      return acc;
    }, initialGroups);
  }, [results]); // Recalculé uniquement lorsque l'état 'results' change

  
  // Calcul du nombre total pour l'affichage général
  const totalResultsCount = results.length;


  // Si la recherche globale est vide (effacée par l'utilisateur), on n'affiche rien.
  if (!globalSearchTerm) {
      return null;
  }

  // --- JSX (Affichage des résultats) ---
  return (
    <div className="absolute top-16 left-0 right-0 z-30 flex justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 shadow-2xl rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            
            <h3 className="text-xl font-bold text-sidebar-primary dark:text-indigo-400 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5" /> 
                Résultats de la Recherche Globale
            </h3>
            
            {/* ... (Loading et Error messages) ... */}
            {loading && <p className="text-center text-gray-500">Recherche en cours...</p>}
            
            {error && (
                <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" /> {error}
                </div>
            )}

            {!loading && !error && totalResultsCount === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Aucun résultat trouvé pour **"{globalSearchTerm}"**.</p>
            )}

            {!loading && totalResultsCount > 0 && (
                <div className="space-y-6">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        **{totalResultsCount}** résultat{totalResultsCount > 1 ? "s" : ""} trouvé{totalResultsCount > 1 ? "s" : ""} pour **"{globalSearchTerm}"** :
                    </p>
                    
                    {/* 🚀 AFFICHAGE DES GROUPES ET DES COMPTES */}
                    {Object.keys(groupedAndCountedResults).map(key => {
                        const group = groupedAndCountedResults[key];
                        const Icon = group.icon; // Le composant icône
                        
                        // N'affiche le groupe que s'il contient des résultats
                        if (group.count === 0) return null; 
                        
                        return (
                            <div key={key} className="space-y-3">
                                <h4 className="text-lg font-bold border-b border-sidebar-primary/20 dark:border-indigo-400/30 pb-1 flex items-center gap-2 text-sidebar-primary dark:text-indigo-400">
                                    <Icon className="h-5 w-5" /> 
                                    {group.label} ({group.count})
                                </h4>
                                
                                {/* Affichage des 3 premiers résultats du groupe */}
                                {group.items.slice(0, 3).map((result, index) => (
                                    <a 
                                        key={result.id || index} 
                                        href={result.id ? `/Espace-avocat/avocatList/${result.id}` : '#'}
                                        className="block p-3 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-150"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Icône et contenu du résultat */}
                                            <Icon className="h-5 w-5 opacity-70" />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{result.title}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{result.details?.description || result.details?.objet || ""}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}

                                {/* Lien "Voir tout" si plus de 3 résultats */}
                                {group.count > 3 && (
                                    <div className="text-right pt-2">
                                        <a href={`/Espace-avocat/search-results?q=${globalSearchTerm}&type=${key}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-sidebar-primary hover:underline">
                                            Voir les {group.count - 3} autres résultats {group.label.toLowerCase()} →
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
}