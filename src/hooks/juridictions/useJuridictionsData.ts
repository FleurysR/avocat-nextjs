// src/hooks/juridictions/useJuridictionsData.ts
import { useState, useEffect } from "react";
import { fetchJuridictions } from "@/services/client-api";
import { Juridiction, JuridictionsApiResponse } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { toast } from "sonner";

// 🚀 NOUVELLE CONSTANTE : Utilisation de la limite par défaut définie dans le fetch.
const API_LIMIT = 10; 

export const useJuridictionsData = () => {
  const [juridictions, setJuridictions] = useState<Juridiction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm } = useSearch();

  useEffect(() => {
    // Réinitialise la page à 1 à chaque nouvelle recherche
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const loadJuridictions = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Correction : Appel de fetchJuridictions avec searchTerm, API_LIMIT (10) et currentPage
        const data: JuridictionsApiResponse = await fetchJuridictions(
          searchTerm,
          API_LIMIT, 
          currentPage
        );

        const members = data.member || [];
        const uniqueJuridictions = Array.from(
          new Set(members.map((j) => j.code))
        )
          .map((code) => members.find((j) => j.code === code))
          .filter((j): j is Juridiction => j !== undefined);

        setJuridictions(uniqueJuridictions);

        setTotalItems(data.totalItems || 0);
        
        // ✅ CORRECTION CLÉ : Calcul des pages totales basé sur l'API_LIMIT (10)
        setTotalPages(Math.ceil((data.totalItems || 0) / API_LIMIT)); 
        
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des juridictions.");
        setJuridictions([]);
        toast.error("Échec du chargement des juridictions.");
      } finally {
        setLoading(false);
      }
    };
    loadJuridictions();
  }, [searchTerm, currentPage]);

  return {
    juridictions,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    searchTerm,
  };
};