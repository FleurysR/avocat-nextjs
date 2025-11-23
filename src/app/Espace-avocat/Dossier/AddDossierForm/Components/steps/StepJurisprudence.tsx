"use client";

import React from 'react';
import { DossierDetails } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Gavel } from 'lucide-react';
import { removeDecisionFromDossier } from '@/services/client-api';

interface StepJurisprudenceProps {
  dossier: DossierDetails;
  decisions: any[];
  setDecisions: (decisions: any[]) => void;
  onDossierUpdated?: (code: string) => Promise<void>;
}

export default function StepJurisprudence({
  dossier,
  decisions,
  setDecisions,
  onDossierUpdated,
}: StepJurisprudenceProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedDecision, setSelectedDecision] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/decisions?query=${encodeURIComponent(searchQuery)}&limit=10`
      );
      const data = await response.json();
      setSearchResults(data.hits || []);
    } catch (err) {
      console.error('❌ Erreur recherche:', err);
      setError('Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }

      const newDecision = {
        decision: {
          code: selectedDecision.code,
          numero: selectedDecision.numero,
          numeroDossier: selectedDecision.numeroDossier || selectedDecision.numero_dossier,
          objet: selectedDecision.objet || selectedDecision.title,
          decisionAt: selectedDecision.decisionAt || selectedDecision.decision_at,
          presidentChambre: selectedDecision.presidentChambre || selectedDecision.president_chambre,
          juridiction: selectedDecision.juridiction,
          formationJudiciaire: selectedDecision.formationJudiciaire || selectedDecision.formation_judiciaire,
          chambre: selectedDecision.chambre
        },
        scorePertinence: 1
      };

      setDecisions([...decisions, newDecision]);
      setSelectedDecision(null);
      setSearchQuery('');
      setSearchResults([]);
      setError(null);

      console.log('✅ Décision ajoutée et sauvegardée');

      if (onDossierUpdated) {
        await onDossierUpdated(dossierCode);
      }
    } catch (err: any) {
      console.error('❌ Erreur ajout:', err);
      setError(err.message || 'Erreur lors de l\'ajout de la décision');
    }
  };

  const handleRemoveDecision = async (index: number) => {
    const decisionToRemove = decisions[index];
    const previousDecisions = [...decisions];

    const newDecisions = decisions.filter((_, i) => i !== index);
    setDecisions(newDecisions);
    setError(null);

    try {
      const dossierCode = (dossier as any).code;
      const decisionCode = decisionToRemove.decision.code;

      console.log('🗑️ Suppression décision via client-api:', {
        dossier: dossierCode,
        decision: decisionCode
      });

      await removeDecisionFromDossier(dossierCode, decisionCode);

      console.log('✅ Décision supprimée et sauvegardée');

      if (onDossierUpdated) {
        await onDossierUpdated(dossierCode);
      }
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;

      if (status === 404) {
        console.warn('ℹ️ Décision déjà supprimée (404), aucun rollback');
        setError(null);
        return;
      }

      console.error('❌ Erreur suppression:', err);
      setDecisions(previousDecisions);
      setError(err.message || 'Erreur lors de la suppression de la décision');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Gavel className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          2. Jurisprudence Similaire
        </h2>
      </div>

      <p className="text-sm text-gray-600">
        Examinez, supprimez ou ajoutez de la jurisprudence pour affiner votre dossier.
      </p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jurisprudence sélectionnée ({decisions.length})
        </h3>

        {decisions.length > 0 ? (
          <div className="space-y-3">
            {decisions.map((decision, idx) => (
              <div
                key={idx}
                className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">⚖️</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <p className="text-base font-bold text-gray-900">
                             Dossier : {decision.decision.numeroDossier || 'N/A'}
                          </p>
                          <p className="text-base font-semibold text-gray-700">
                             {formatDate(decision.decision.decisionAt)}
                          </p>
                        </div>

                        <p className="text-sm text-gray-800 leading-relaxed mb-2">
                          <span className="font-semibold">Objet :</span>{' '}
                          {decision.decision.objet || 'Pas de description'}
                        </p>

                        {decision.decision.presidentChambre && (
                          <p className="text-sm text-indigo-700 font-semibold bg-indigo-100 px-3 py-1.5 rounded-lg inline-block">
                             Président : {decision.decision.presidentChambre}
                          </p>
                        )}

                        <div className="flex gap-2 mt-3 flex-wrap">
                          {decision.decision.juridiction && (
                            <Badge variant="outline" className="text-xs bg-white">
                              📍 {decision.decision.juridiction.designation || decision.decision.juridiction}
                            </Badge>
                          )}
                          {decision.decision.formationJudiciaire && (
                            <Badge variant="outline" className="text-xs bg-white">
                              🏛️ {decision.decision.formationJudiciaire.designation || decision.decision.formationJudiciaire}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right bg-blue-100 px-3 py-2 rounded-lg">
                      <p className="text-sm font-bold text-blue-700">
                        Pertinence
                      </p>
                      <p className="text-2xl font-black text-blue-600">
                        {(decision.scorePertinence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveDecision(idx)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-1"
                    >
                      ✕ Retirer
                    </button>
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

      {/* Section ajout */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une jurisprudence</h3>

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une décision..."
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
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-bold text-gray-900">
                         {result.numeroDossier || result.numero_dossier || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-600">
                         {formatDate(result.decisionAt || result.decision_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">
                      {result.objet || result.title}
                    </p>
                    {(result.presidentChambre || result.president_chambre) && (
                      <p className="text-xs text-indigo-600 font-semibold">
                         {result.presidentChambre || result.president_chambre}
                      </p>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="decision-select"
                    checked={selectedDecision?.code === result.code}
                    onChange={() => setSelectedDecision(result)}
                    className="w-5 h-5 cursor-pointer text-blue-600"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddDecision}
              disabled={!selectedDecision}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 mt-4 text-base"
            >
              ✓ Ajouter la décision sélectionnée
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
