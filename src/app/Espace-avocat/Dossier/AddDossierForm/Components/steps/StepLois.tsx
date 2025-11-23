"use client";

import React from 'react';
import { DossierDetails } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { removeLoiFromDossier } from '@/services/client-api';

interface StepLoisProps {
  dossier: DossierDetails;
  lois: any[];
  setLois: (lois: any[]) => void;
  onDossierUpdated?: (code: string) => Promise<void>;
}

export default function StepLois({
  dossier,
  lois,
  setLois,
  onDossierUpdated,
}: StepLoisProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedLoi, setSelectedLoi] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  // ✅ NOUVEAU : État pour gérer l'expansion des contenus
  const [expandedLois, setExpandedLois] = React.useState<Set<number>>(new Set());

  // ✅ NOUVELLE FONCTION : Toggle expansion
  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedLois);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLois(newExpanded);
  };

  // ✅ NOUVELLE FONCTION : Tronquer le texte
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Recherche de lois
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/lois?query=${encodeURIComponent(searchQuery)}&limit=10`
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

  const handleAddLoi = async () => {
    if (!selectedLoi) return;

    try {
      const dossierCode = (dossier as any).code;

      const response = await fetch(`/api/dossiers/${dossierCode}/loi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loi_article_id: selectedLoi.id || selectedLoi.code,
          scorePertinence: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }

      const newLoi = {
        loiArticle: {
          code: selectedLoi.code,
          numero: selectedLoi.numero,
          content: selectedLoi.content || selectedLoi.title,
          loi: selectedLoi.loi
        },
        scorePertinence: 1
      };

      setLois([...lois, newLoi]);
      setSelectedLoi(null);
      setSearchQuery('');
      setSearchResults([]);
      setError(null);

      console.log('✅ Loi ajoutée et sauvegardée');

      if (onDossierUpdated) {
        await onDossierUpdated(dossierCode);
      }
    } catch (err: any) {
      console.error('❌ Erreur ajout:', err);
      setError(err.message || 'Erreur lors de l\'ajout de la loi');
    }
  };

  const handleRemoveLoi = async (index: number) => {
    const loiToRemove = lois[index];
    const previousLois = [...lois];

    const newLois = lois.filter((_, i) => i !== index);
    setLois(newLois);
    setError(null);

    try {
      const dossierCode = (dossier as any).code;
      const loiCode = loiToRemove.loiArticle.code;

      console.log('🗑️ Suppression loi via client-api:', {
        dossier: dossierCode,
        loi: loiCode,
      });

      await removeLoiFromDossier(dossierCode, loiCode);

      console.log('✅ Loi supprimée et sauvegardée');

      if (onDossierUpdated) {
        await onDossierUpdated(dossierCode);
      }
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;

      if (status === 404) {
        console.warn('ℹ️ Loi déjà supprimée (404), aucun rollback');
        setError(null);
        return;
      }

      console.error('❌ Erreur suppression:', err);
      setLois(previousLois);
      setError(err.message || 'Erreur lors de la suppression de la loi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          3. Articles de Loi Pertinents
        </h2>
      </div>

      <p className="text-sm text-gray-600">
        Examinez, supprimez ou ajoutez des articles de loi pour affiner votre dossier.
      </p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">❌ {error}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lois sélectionnées ({lois.length})
        </h3>

        {lois.length > 0 ? (
          <div className="space-y-3">
            {lois.map((article, idx) => {
              const isExpanded = expandedLois.has(idx);
              const content = article.loiArticle.content || '';
              const shouldShowToggle = content.length > 150;

              return (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">⚖️</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-base font-bold text-gray-900">
                               Article {article.loiArticle.numero || 'N/A'}
                            </p>
                            <p className="text-base font-semibold text-purple-700">
                               {typeof article.loiArticle.loi === 'string'
                                ? article.loiArticle.loi
                                : (article.loiArticle.loi as any)?.titre ||
                                  (article.loiArticle.loi as any)?.code ||
                                  'N/A'}
                            </p>
                          </div>

                          {/* ✅ CONTENU TRONQUÉ AVEC BOUTON D'EXPANSION */}
                          {content && (
                            <div>
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <span className="font-semibold">Contenu :</span>{' '}
                                {isExpanded ? content : truncateText(content, 150)}
                              </p>
                              
                              {/* ✅ BOUTON "VOIR PLUS / VOIR MOINS" */}
                              {shouldShowToggle && (
                                <button
                                  onClick={() => toggleExpanded(idx)}
                                  className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4" />
                                      ...
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4" />
                                      ...
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 mt-3 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-white">
                               Législation applicable
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right bg-purple-100 px-3 py-2 rounded-lg">
                        <p className="text-sm font-bold text-purple-700">
                          Pertinence
                        </p>
                        <p className="text-2xl font-black text-purple-600">
                          {(article.scorePertinence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveLoi(idx)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-1"
                      >
                        ✕ Retirer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
            <p className="text-gray-600">Aucune loi sélectionnée</p>
          </div>
        )}
      </div>

      {/* Section ajout */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ajouter un article de loi
        </h3>

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article de loi..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-3 mb-4">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors"
                onClick={() => setSelectedLoi(result)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-900">
                         Article {result.numero || 'N/A'}
                      </span>
                      <span className="text-sm text-purple-700 font-semibold">
                         {result.loi?.titre || result.loi?.code || 'N/A'}
                      </span>
                    </div>
                    {result.content && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {result.content}
                      </p>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="loi-select"
                    checked={selectedLoi?.code === result.code}
                    onChange={() => setSelectedLoi(result)}
                    className="w-5 h-5 cursor-pointer text-purple-600"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddLoi}
              disabled={!selectedLoi}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 mt-4 text-base"
            >
              ✓ Ajouter la loi sélectionnée
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
