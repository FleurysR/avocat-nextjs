import { useState, useEffect } from "react";
import { fetchAvocatDetails } from "@/services/client-api";
import { AvocatDetails } from "@/types";
import { toast } from "sonner";

export const useAvocatModal = () => {
  const [selectedAvocatCode, setSelectedAvocatCode] = useState<string | null>(null);
  const [detailedAvocat, setDetailedAvocat] = useState<AvocatDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const loadAvocatDetails = async () => {
      if (!selectedAvocatCode) return;
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const data = await fetchAvocatDetails(selectedAvocatCode);
        setDetailedAvocat(data);
      } catch (err: unknown) {
        setErrorDetails("Erreur lors de la récupération des détails.");
        toast.error("Échec du chargement des détails de l'avocat.");
      } finally {
        setLoadingDetails(false);
      }
    };
    loadAvocatDetails();
  }, [selectedAvocatCode]);

  const openModal = (code: string) => setSelectedAvocatCode(code);
  const closeModal = () => {
    setSelectedAvocatCode(null);
    setDetailedAvocat(null);
    setErrorDetails(null);
  };

  return {
    selectedAvocatCode,
    detailedAvocat,
    loadingDetails,
    errorDetails,
    openModal,
    closeModal,
  };
};