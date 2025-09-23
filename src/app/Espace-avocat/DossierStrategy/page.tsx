"use client";

import { useState, useEffect } from "react";
import { fetchDossierStrategies } from "@/services/client-api";
import { DossierStrategy } from "@/types";

export default function DossierStrategyPage() {
  const [strategies, setStrategies] = useState<DossierStrategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDossierStrategies()
      .then((data) => {
        setStrategies(data.member); // 👈 Ici on prend la liste
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Liste des stratégies de dossier 📂</h1>
      {strategies.length === 0 ? (
        <p>Aucune stratégie trouvée.</p>
      ) : (
        <ul>
          {strategies.map((s) => (
            <li key={s.code}>{s.code }- {
                s.designation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
