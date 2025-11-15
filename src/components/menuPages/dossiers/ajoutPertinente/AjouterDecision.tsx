import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchDecisions, addDecisionToDossier } from "@/services/client-api";
import type { Decision, DossierDetails } from "@/types";

interface AjouterDecisionProps {
  dossier: DossierDetails;
  onNext: () => void;
}

export default function AjouterDecision({ dossier, onNext }: AjouterDecisionProps) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selected, setSelected] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDecisions(dossier.keywords.join(" "), 5, 1).then(res => setDecisions(res.hits || []));
  }, [dossier]);

  async function handleAdd() {
    if (!selected) return;
    setLoading(true);
    await addDecisionToDossier(dossier.code, selected.code);
    setLoading(false);
    onNext();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sélectionnez une décision pertinente</h2>
      <ul className="space-y-3 mb-6">
        {decisions.map(decision => (
          <li
            key={decision.code}
            className={`border rounded p-3 flex items-center gap-4 bg-white/70 cursor-pointer ${selected?.code === decision.code ? 'ring-2 ring-blue-400' : ''}`}
            onClick={() => setSelected(decision)}
          >
            <span className="font-semibold">{decision.objet || `Décision ${decision.numeroDossier}`}</span>
            <span className="text-xs text-gray-600 ml-auto">Pertinence : {decision._rankingScore ? decision._rankingScore.toFixed(2) : '?'}</span>
          </li>
        ))}
      </ul>
      <Button onClick={handleAdd} disabled={!selected || loading} className="w-full mt-3">
        {loading ? "Ajout en cours..." : "Ajouter et continuer"}
      </Button>
    </div>
  );
}
