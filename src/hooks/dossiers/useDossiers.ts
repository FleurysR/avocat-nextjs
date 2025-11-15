// src/hooks/useDossiers.ts
import { useState, useEffect } from "react";
import { fetchDossiers, createDossier, updateDossier } from "@/services/client-api";
import type { Dossier, DossierDetails, NewDossierData } from "@/types";

export function useDossiers(query = '', page = 1, pageSize = 10) {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récup automatiques des dossiers à chaque changement de recherche/page
  useEffect(() => {
    setLoading(true);
    fetchDossiers(query, pageSize, page)
      .then(data => {
        setDossiers(data.data || []);
        setTotalCount(data.totalCount || 0);
        setError(null);
      })
      .catch(err => {
        setError("Erreur lors de la récupération des dossiers.");
      })
      .finally(() => setLoading(false));
  }, [query, page, pageSize]);

  // Appelle la création et rafraîchit la liste
  const create = async (dossierData: NewDossierData) => {
    await createDossier(dossierData);
    // Recharge la liste après création
    const data = await fetchDossiers(query, pageSize, page);
    setDossiers(data.data || []);
    setTotalCount(data.totalCount || 0);
  };

  // Pour update (similaire)
  const update = async (code: string, dossierData: NewDossierData) => {
    await updateDossier(code, dossierData);
    // Recharge la liste après update
    const data = await fetchDossiers(query, pageSize, page);
    setDossiers(data.data || []);
    setTotalCount(data.totalCount || 0);
  };

  return {
    dossiers,
    loading,
    error,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    totalItems: totalCount, // <-- Ajoute cette ligne pour compatibilité immédiate
    create,
    update,
    page,
    pageSize,
  };
}
