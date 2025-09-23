// src/components/context/SearchContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { globalSearch } from "@/services/client-api";
import { GlobalSearchResult } from "@/types";
import { toast } from "sonner";

// L'interface a été mise à jour pour inclure les résultats et l'état de chargement.
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: GlobalSearchResult[] | null; // Les résultats de la recherche.
  loading: boolean; // Pour savoir si une recherche est en cours.
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Le hook useEffect est essentiel. Il se déclenche à chaque fois que `searchTerm` change.
  useEffect(() => {
    // Si le champ de recherche est vide, on réinitialise tout.
    if (!searchTerm) {
      setResults(null);
      setLoading(false);
      return;
    }

    // On utilise un "debounce" pour ne pas envoyer une requête API à chaque lettre tapée.
    // Cela attend 500 ms après la dernière frappe.
    const timer = setTimeout(async () => {
      setLoading(true); // On active l'état de chargement.
      try {
        const searchResults = await globalSearch(searchTerm); // On appelle notre fonction API.
        setResults(searchResults); // On stocke les résultats.
        if (searchResults.length === 0) {
          toast.info("Aucun résultat trouvé.");
        }
      } catch (error) {
        console.error("Échec de la recherche :", error);
        toast.error("Échec de la recherche. Veuillez réessayer.");
        setResults([]);
      } finally {
        setLoading(false); // On désactive l'état de chargement.
      }
    }, 500);

    // Cette fonction de nettoyage est importante pour annuler le timer si l'utilisateur tape une nouvelle lettre.
    return () => clearTimeout(timer);
  }, [searchTerm]); // La dépendance est `searchTerm`, donc le hook s'exécute à chaque changement.

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, results, loading }}>
      {children}
    </SearchContext.Provider>
  );
}