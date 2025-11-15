"use client";

/**
 * =====================================================
 * COMPOSANT : ÉTAPE 2 - JURISPRUDENCE
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/steps/StepJurisprudence.tsx
 */

import React, { useState } from 'react';
import { DossierDetails } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Gavel } from 'lucide-react';

interface StepJurisprudenceProps {
  dossier: DossierDetails;
}

export default function StepJurisprudence({ dossier }: StepJurisprudenceProps) {
  const [decisions, setDecisions] = useState<any[]>(dossier.dossierDecisions || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);

  // Recherche de décisions
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/decisions?query=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await response.json();
      setSearchResults(data.hits || []);
    } catch (err) {
      console.error('❌ Erreur recherche:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une décision
  const handleAddDecision = async () => {
    if (!selectedDecision) return;

    try {
      const dossierCode = (dossier as any).code;
      
      const response = await fetch(`/api/dossiers/${dossierCode}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: selectedDecision.id || selectedDecision.code,
          scorePertinence: 1
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout');

      const newDecision = {
        decision: {
          code: selectedDecision.code,
          objet: selectedDecision.objet || selectedDecision.title,
          numero: selectedDecision.numero
        },
        scorePertinence: 1
      };

      setDecisions([...decisions, newDecision]);
      setSelectedDecision(null);
      setSearchQuery('');
      setSearchResults([]);

      console.log('✅ Décision ajoutée');
    } catch (err) {
      console.error('❌ Erreur ajout:', err);
    }
  };

  // Supprimer une décision
  const handleRemoveDecision = (index: number) => {
    const newDecisions = decisions.filter((_, i) => i !== index);
    setDecisions(newDecisions);
    console.log('✅ Décision supprimée');
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex items-center gap-3 mb-8">
        <Gavel className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          2. Jurisprudence Similaire
        </h2>
      </div>

      <p className="text-sm text-gray-600">
        Examinez, supprimez ou ajoutez de la jurisprudence pour affiner votre dossier.
      </p>

      {/* Liste des décisions sélectionnées */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Jurisprudence sélectionnée</h3>

        {decisions.length > 0 ? (
          <div className="space-y-3">
            {decisions.map((decision, idx) => (
              <div
                key={idx}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">»</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Decision  n° {decision.decision.code}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {decision.decision.objet || 'Pas de description'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Président: {decision.decision.president_chambre || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">
                        Pertinence: {(decision.scorePertinence * 100).toFixed(0)}%
                      </p>
                      <button
                        onClick={() => handleRemoveDecision(idx)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold mt-1 flex items-center gap-1"
                      >
                        ✕ Ne pas utiliser
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
            <p className="text-gray-600">Aucune jurisprudence sélectionnée</p>
          </div>
        )}
      </div>

      {/* Section ajout de jurisprudence */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une jurisprudence</h3>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une autre décision..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="space-y-3 mb-4">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => setSelectedDecision(result)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {result.objet || result.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Code: {result.code}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="decision-select"
                    checked={selectedDecision?.code === result.code}
                    onChange={() => setSelectedDecision(result)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            ))}

            {/* Bouton ajouter */}
            <button
              onClick={handleAddDecision}
              disabled={!selectedDecision}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 mt-4"
            >
              + Ajouter la décision sélectionnée
            </button>
          </div>
        )}

        {searchResults.length === 0 && searchQuery && !loading && (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucun résultat trouvé pour "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}
