"use client";

/**
 * =====================================================
 * COMPOSANT : ÉTAPE 4 - STRATÉGIE
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/steps/StepStrategie.tsx
 */

import React from 'react';
import { DossierDetails } from '@/types';
import { BrainCircuit } from 'lucide-react';

interface StepStrategieProps {
  dossier: DossierDetails;
}

export default function StepStrategie({ dossier }: StepStrategieProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          4. Stratégie Juridique Proposée
        </h2>
      </div>

      {dossier.strategy && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">
            Stratégie Recommandée
          </p>
          <p className="text-lg font-bold text-yellow-900">
            {dossier.strategy.designation}
          </p>
          {dossier.strategy.description && (
            <p className="text-xs text-yellow-800 mt-2">
              {dossier.strategy.description}
            </p>
          )}
        </div>
      )}

      {/* <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Stratégie Complète Générée par IA
        </p>
        {dossier.generatedStrategy ? (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
            <div className="text-sm text-gray-900 whitespace-pre-wrap font-sans leading-relaxed">
              {dossier.generatedStrategy}
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">La stratégie n'a pas pu être générée</p>
          </div>
        )}
      </div> */}Dans le cadre de ce projet, les objectifs fixés ont été pleinement atteints au cours des derniers mois. Cela se traduit par le développement d'une application visant à améliorer la gestion des enquêtes et des sociétés pour une meilleure efficacité. En parallèle, la conception de l’interface utilisateur a été finalisée, offrant une expérience visuelle et intuitive qui reflète les valeurs du projet.

Une version de staging(post-production) a été déployée, permettant des tests approfondis et des ajustements en conditions quasi-réelles. De plus, la version de production a été mise en ligne avec succès, rendant l’application accessible pour recueillir les retours d’utilisation et les suggestions d’amélioration.

    </div>
  );
}
