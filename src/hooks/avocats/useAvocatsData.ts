// src/hooks/avocats/useAvocatsData.ts

import { useState, useEffect } from "react";
import { fetchAvocats } from "@/services/client-api";
import { Avocat, AvocatsApiResponse } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { useDebounce } from "@/components/context/useDebounce";
import { toast } from "sonner";

const PAGE_SIZE = 10;
type SortOrder = 'asc' | 'desc' | null;
type SortField = 'nom' | 'ville' | null;

export const useAvocatsData = () => {
  const [avocats, setAvocats] = useState<Avocat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>(null); // NOUVEL ÉTAT
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const { searchTerm } = useSearch();
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Logique pour gérer le tri
  const onSortChange = (field: "nom" | "ville") => {
    // Si l'utilisateur clique sur la même colonne, on inverse l'ordre
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Sinon, on trie par cette nouvelle colonne en ordre ascendant
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Réinitialise la pagination à chaque changement
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortField, sortOrder]);

  // Appelle l'API lorsque la page, la recherche ou le tri change
  useEffect(() => {
    const loadAvocats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: AvocatsApiResponse = await fetchAvocats(
          debouncedSearch,
          sortField,
          sortOrder,
          PAGE_SIZE,
          currentPage
        );

        const fetchedAvocats = Array.isArray(data.member) ? data.member : [];
        setAvocats(fetchedAvocats);
        setTotalItems(data.totalItems || fetchedAvocats.length);
        setTotalPages(Math.ceil((data.totalItems || fetchedAvocats.length) / PAGE_SIZE));
      } catch (err: unknown) {
        setError("Erreur lors de la récupération des avocats.");
        toast.error("Échec du chargement des avocats.");
      } finally {
        setLoading(false);
      }
    };
    loadAvocats();
  }, [currentPage, debouncedSearch, sortField, sortOrder]);

  return {
    avocats,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    debouncedSearch,
    sortField,
    sortOrder,
    onSortChange, // La nouvelle fonction de tri
  };
};