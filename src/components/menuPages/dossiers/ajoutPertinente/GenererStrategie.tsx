import React from "react";
import type { DossierDetails } from "@/types";

interface GenererStrategieProps {
  dossier: DossierDetails;
  onNext: () => void;
}

export default function GenererStrategie({ dossier, onNext }: GenererStrategieProps) {
  return <div>Module génération de stratégie (à compléter)</div>;
}


