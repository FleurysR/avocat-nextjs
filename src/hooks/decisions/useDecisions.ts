// src/hooks/useDecisions.ts
import { useState, useEffect } from "react";
import { fetchDecisions  } from "@/services/client-api";
import type { DecisionsFilters } from "@/types";
import { Decision } from "@/types";
import { useDebounce } from "@/components/context/useDebounce";

const PAGE_SIZE = 10;

export function useDecisions(
  searchQuery: string,
  currentPage: number,
  filters: DecisionsFilters // 1. Ajoutez les filtres en tant que paramètre
) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utilisez le debouncer pour la requête et les filtres
  const debouncedSearch = useDebounce(searchQuery, 750);
  const debouncedFilters = useDebounce(filters, 750); // 2. Déboucez aussi les filtres

  useEffect(() => {
    const loadDecisions = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        // 3. Passez les filtres à la fonction d'appel API
        const data = await fetchDecisions(
          debouncedSearch,
          PAGE_SIZE,
          offset,
          debouncedFilters
        );
        setDecisions(data.hits || []);
        setTotalHits(data.estimatedTotalHits || 0);
        setTotalPages(Math.ceil((data.estimatedTotalHits || 0) / PAGE_SIZE));
      } catch {
        setError("Erreur lors de la récupération des décisions.");
      } finally {
        setLoading(false);
      }
    };
    loadDecisions();
  }, [currentPage, debouncedSearch, debouncedFilters]); // 4. Ajoutez les dépendances de filtre

  return {
    decisions,
    loading,
    error,
    totalPages,
    totalHits,
    currentPage,
    PAGE_SIZE,
  };
}