// src/hooks/loi/useLoiCategories.ts
// Ce hook est correct et renvoie les données de catégories.
// Il peut être renommé pour plus de clarté si vous le souhaitez, mais il fonctionne.
import { useState, useEffect } from "react";
import { fetchLoiCategories } from "@/services/client-api";
import { LoiCategoryApiResponse } from "@/types";

export const useLoiCategories = () => {
  const [categories, setCategories] = useState<LoiCategoryApiResponse['member']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLoiCategories();
        setCategories(data.member);
      } catch (err: unknown) {
        setError("Erreur lors du chargement des catégories.");
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  return { categories, loading, error };
};