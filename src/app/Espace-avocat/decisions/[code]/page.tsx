"use client";

import { use } from "react";
import { useDecisionDetails } from "@/hooks/decisions/useDecisionDetails";
import DecisionDetailsPage from "@/components/modals/DecisionDetail"; 
interface DecisionPageProps {
  params: Promise<{ code: string }>;
}

export default function DecisionPage({ params }: DecisionPageProps) {
  const { code } = use(params);
  const { detailedDecision, loadingDetails, errorDetails } = useDecisionDetails(code);
  return (
    <DecisionDetailsPage
      detailedDecision={detailedDecision}
      loading={loadingDetails}
      error={errorDetails}
    />
  );
}