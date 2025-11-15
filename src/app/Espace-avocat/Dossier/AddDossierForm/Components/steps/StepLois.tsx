"use client";

/**
 * =====================================================
 * COMPOSANT : ÉTAPE 3 - LOIS
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/steps/StepLois.tsx
 */

import React from 'react';
import { DossierDetails } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Scale } from 'lucide-react';

interface StepLoisProps {
  dossier: DossierDetails;
}

export default function StepLois({ dossier }: StepLoisProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          3. Articles de Loi Pertinents
        </h2>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <p className="font-semibold text-gray-900">
          {dossier.dossierLoiArticles?.length || 0} article(s) trouvé(s)
        </p>
      </div>

      {(dossier.dossierLoiArticles || []).length > 0 ? (
        <div className="space-y-3">
          {dossier.dossierLoiArticles?.map((article, idx) => (
            <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 text-base">
                    Article {article.loiArticle.numero}
                  </p>
                  <p className="text-xs text-purple-700 mt-1 font-mono">
                    Code: {article.loiArticle.code} | Loi: {
                      typeof article.loiArticle.loi === 'string' 
                        ? article.loiArticle.loi 
                        : (article.loiArticle.loi as any)?.code ?? 'N/A'
                    }
                  </p>
                  {article.loiArticle.content && (
                    <p className="text-xs text-purple-800 mt-2 line-clamp-2">
                      {article.loiArticle.content}
                    </p>
                  )}
                </div>
                <Badge className="ml-4 bg-purple-500 text-white whitespace-nowrap">
                  Score: {(article.scorePertinence * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Aucun article de loi trouvé</p>
        </div>
      )}
    </div>
  );
}
