// src/hooks/useDecisionDetails.ts
import { useState, useEffect } from "react";
import { fetchDecisionByCode } from "@/services/client-api";
import { DecisionDetails } from "@/types";

export function useDecisionDetails(decisionCode: string | null) {
  const [detailedDecision, setDetailedDecision] = useState<DecisionDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const loadDecisionDetails = async () => {
      if (!decisionCode) return;
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const data = await fetchDecisionByCode(decisionCode);
        setDetailedDecision(data);
      } catch {
        setErrorDetails("Erreur lors de la récupération des détails.");
      } finally {
        setLoadingDetails(false);
      }
    };
    loadDecisionDetails();
  }, [decisionCode]);

  return { detailedDecision, loadingDetails, errorDetails };
}