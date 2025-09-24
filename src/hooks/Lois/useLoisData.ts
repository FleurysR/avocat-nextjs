// src/hooks/loi/useLoisData.ts

"use client"; // <-- Ajoutez cette ligne tout en haut

import { useState, useEffect } from "react";
import { fetchLois } from "@/services/client-api";
import { LoisApiResponse, Loi } from "@/types";
import { useDebounce } from "@/components/context/useDebounce"; 

export const useLoisData = () => {
  const [lois, setLois] = useState<Loi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const getLois = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLois(debouncedSearch); 
        
        if (Array.isArray(data.member)) {
          setLois(data.member);
        } else {
          setError("Invalid data format received.");
        }
      } catch (err: unknown) {
        setError("Erreur lors du chargement des lois.");
      } finally {
        setLoading(false);
      }
    };
    getLois();
  }, [debouncedSearch]);

  return { 
    lois, 
    loading, 
    error,
    debouncedSearch,
    onSearchChange 
  };
};