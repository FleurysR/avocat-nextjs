// src/hooks/dossiers/useDossierDetails.ts
import { useState, useEffect } from "react";
import { fetchDossierByCode } from "@/services/client-api";
import { DossierDetails } from "@/types";
import { toast } from "sonner";

export function useDossierDetails(dossierCode: string | null) {
  const [detailedDossier, setDetailedDossier] = useState<DossierDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const loadDossierDetails = async () => {
      if (!dossierCode) return;
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const data = await fetchDossierByCode(dossierCode);
        setDetailedDossier(data);
      } catch {
        setErrorDetails("Erreur lors de la récupération des détails du dossier.");
        toast.error("Erreur de chargement des détails.");
      } finally {
        setLoadingDetails(false);
      }
    };
    loadDossierDetails();
  }, [dossierCode]);

  return { detailedDossier, loadingDetails, errorDetails };
}