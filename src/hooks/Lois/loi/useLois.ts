// src/hooks/loi/useLois.ts
import { useState, useEffect } from "react";
import { fetchLois } from "@/services/client-api";
import { LoisApiResponse, Loi } from "@/types";

export const useLois = () => {
  const [lois, setLois] = useState<Loi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLois = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLois();
        setLois(data.member);
      } catch (err: unknown) {
        setError("Erreur lors du chargement des lois.");
      } finally {
        setLoading(false);
      }
    };
    getLois();
  }, []);

  return { lois, loading, error };
};