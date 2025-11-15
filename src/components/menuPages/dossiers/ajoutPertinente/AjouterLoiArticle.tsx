import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchLoiArticles, addArticleToDossier } from "@/services/client-api";
import type { LoiArticle, DossierDetails, DossierLoiArticle } from "@/types";

interface AjouterLoiArticleProps {
  dossier: DossierDetails;
  onNext: () => void;
}

export default function AjouterLoiArticle({ dossier, onNext }: AjouterLoiArticleProps) {
  const [articles, setArticles] = useState<LoiArticle[]>([]);
  const [selected, setSelected] = useState<LoiArticle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoiArticles(dossier.keywords.join(" "), 5, 1)
      .then((res: { hits: LoiArticle[] }) => setArticles(res.hits || []));
  }, [dossier]);

  async function handleAdd() {
    if (!selected) return;
    setLoading(true);
    await addArticleToDossier(dossier.code, selected.code);
    setLoading(false);
    onNext();
  }

  return (
    <div>
      {/* Affiche les articles déjà liés au dossier */}
      {dossier.dossierLoiArticles && dossier.dossierLoiArticles.length > 0 && (
        <div className="border bg-green-50 rounded p-3 mb-5">
          <span className="font-semibold">Articles déjà associés :</span>
          <ul className="ml-4 mt-2 list-disc">
            {dossier.dossierLoiArticles.map((a: DossierLoiArticle, idx: number) => (
              <li key={a.loiArticle.code || idx}>
                Article {a.loiArticle.code} — n°{a.loiArticle.numero}
                {a.scorePertinence !== undefined && (
                  <span className="ml-2 text-xs text-green-700">(Pertinence : {a.scorePertinence})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Sélectionnez un article de loi pertinent</h2>
      <ul className="space-y-3 mb-6">
        {articles.map((article: LoiArticle) => (
          <li
            key={article.code}
            className={`border rounded p-3 flex items-center gap-4 bg-white/70 cursor-pointer ${selected?.code === article.code ? 'ring-2 ring-green-400' : ''}`}
            onClick={() => setSelected(article)}
          >
            <span className="font-semibold">Article {article.code} — n°{article.numero}</span>
            <span className="text-xs text-gray-600 ml-auto">Pertinence : {article._rankingScore ? article._rankingScore.toFixed(2) : '?'}</span>
          </li>
        ))}
      </ul>
      <Button onClick={handleAdd} disabled={!selected || loading} className="w-full mt-3">
        {loading ? "Ajout en cours..." : "Ajouter et continuer"}
      </Button>
    </div>
  );
}
