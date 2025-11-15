import React, { useState } from "react";
import type { DossierDetails } from "@/types";
import AjouterDecision from "./AjouterDecision";
import AjouterLoiArticle from "./AjouterLoiArticle";
import GenererStrategie from "./GenererStrategie";

// Déclare ici l'interface des props :
interface DossierEnrichissementProps {
  dossier: DossierDetails;
}

export default function DossierEnrichissement({ dossier }: DossierEnrichissementProps) {
  const [step, setStep] = useState("decision");

  return (
    <div className="space-y-8">
      {step === "decision" && (
        <AjouterDecision dossier={dossier} onNext={() => setStep("article")} />
      )}
      {step === "article" && (
        <AjouterLoiArticle dossier={dossier} onNext={() => setStep("strategie")} />
      )}
      {step === "strategie" && (
        <GenererStrategie dossier={dossier} onNext={() => setStep("done")} />
      )}
      {step === "done" && (
        <div className="text-center text-green-700 text-xl font-semibold py-12">
          Dossier enrichi et complété !
        </div>
      )}
    </div>
  );
}
