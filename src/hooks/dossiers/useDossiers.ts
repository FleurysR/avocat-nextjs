// src/hooks/dossiers/useDossiers.ts
import { useState, useEffect } from "react";
import { fetchDossiers } from "@/services/client-api";
import { Dossier } from "@/types";
import { useDebounce } from "@/components/context/useDebounce";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export function useDossiers(searchQuery: string, currentPage: number) {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDossiers(debouncedSearch, ITEMS_PER_PAGE, currentPage);
        
        const sortedDossiers = data?.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setDossiers(sortedDossiers || []);
        setTotalItems(data?.totalCount || 0);
      } catch (err) {
        setError("Impossible de charger les dossiers. Veuillez réessayer.");
        toast.error("Erreur de chargement des dossiers.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, currentPage]);

  return { dossiers, loading, error, totalItems, totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE) };
}