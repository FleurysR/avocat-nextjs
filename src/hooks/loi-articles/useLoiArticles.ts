import { useState, useEffect } from "react";
import { fetchLoiArticles } from "@/services/client-api";
import { useDebounce } from "@/components/context/useDebounce";
import { LoiArticle } from "@/types";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export function useLoiArticles(searchTerm: string, currentPage: number) {
  const [articles, setArticles] = useState<LoiArticle[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 750);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const data = await fetchLoiArticles(debouncedSearch, PAGE_SIZE, offset);
        
        setArticles(data.hits || []);
        setTotalItems(data.estimatedTotalHits || 0);
        setTotalPages(Math.ceil((data.estimatedTotalHits || 0) / PAGE_SIZE));
      } catch (err) {
        setError("Impossible de charger les articles. Veuillez réessayer.");
        toast.error("Erreur de chargement des articles.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, debouncedSearch]);

  return { articles, totalPages, totalItems, loading, error };
}