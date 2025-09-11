// src/hooks/useDecisions.ts
import { useState, useEffect } from "react";
import { fetchDecisions } from "@/services/client-api";
import { Decision } from "@/types";
import { useDebounce } from "@/components/context/useDebounce";

const PAGE_SIZE = 10;

export function useDecisions(searchQuery: string, currentPage: number) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MODIFIEZ CETTE LIGNE
  const debouncedSearch = useDebounce(searchQuery, 750); // <-- Changé de 400 à 750

  useEffect(() => {
    const loadDecisions = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const data = await fetchDecisions(debouncedSearch, PAGE_SIZE, offset);
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
  }, [currentPage, debouncedSearch]);

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