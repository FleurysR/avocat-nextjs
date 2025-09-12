import { useState, useEffect } from "react";
import { fetchAvocats } from "@/services/client-api";
import { Avocat, AvocatsApiResponse } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { useDebounce } from "@/components/context/useDebounce";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export const useAvocatsData = () => {
  const [avocats, setAvocats] = useState<Avocat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm } = useSearch();
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const loadAvocats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: AvocatsApiResponse = await fetchAvocats(debouncedSearch, PAGE_SIZE, currentPage);
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
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return {
    avocats,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    debouncedSearch,
  };
};