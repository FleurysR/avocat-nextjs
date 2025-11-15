'use client';

import React, { useState } from 'react';
import { createDossier } from '@/services/client-api';
import type { DossierDetails, NewDossierData } from '@/types';
import AjouterDecision from '@/components/menuPages/dossiers/ajoutPertinente/AjouterDecision';
import AjouterLoiArticle from '@/components/menuPages/dossiers/ajoutPertinente/AjouterLoiArticle';
import GenererStrategie from '@/components/menuPages/dossiers/ajoutPertinente/GenererStrategie';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText } from 'lucide-react';

export default function AnalyseIAForm() {
  const [description, setDescription] = useState('');
  const [suggestion, setSuggestion] = useState<DossierDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  async function handleAnalyse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createDossier({ description } as NewDossierData);
      setSuggestion(res); // Reçoit la suggestion IA du dossier
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de l'analyse IA");
    }
    setLoading(false);
  }

  function handleValider(e: React.MouseEvent) {
    e.preventDefault();
    setValidated(true);
    // Ici, tu peux ajouter un appel API si tu veux vraiment valider côté serveur
    // Par exemple: await api.post(`/api/dossiers/${suggestion.code}/valider`);
  }

  return (
    <div className="min-h-screen bg-[url('/bg-pattern.svg'),_#f8fafc] flex justify-center items-start pt-12 px-3">
      <div className="w-full max-w-5xl">
        {!suggestion ? (
          <Card className="shadow-2xl border border-blue-200 bg-white/70 backdrop-blur-lg w-full max-w-5xl mx-auto p-10 md:p-16 rounded-3xl">
            <CardHeader className="flex flex-row items-center gap-6 pb-4">
              <Sparkles className="text-blue-600 w-10 h-10" />
              <div>
                <CardTitle className="text-4xl font-bold">Créer un dossier – Analyse IA</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Décris précisément votre litige : l’IA propose un dossier pré-rempli, à compléter ci-dessous.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-8" onSubmit={handleAnalyse}>
                <Textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex : Contrat rompu sans préavis, Chambre commerciale…"
                  className="resize-none min-h-[140px] text-lg p-6 focus:ring-4 focus:ring-blue-400 bg-white/70 rounded-xl backdrop-blur-md"
                  disabled={loading}
                  autoFocus
                />
                {error && (
                  <Alert variant="destructive" className="mb-2 text-base">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" disabled={loading} size="lg" className="font-semibold text-base gap-2 w-full bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
                  {loading ? <Loader2 className="animate-spin w-7 h-7" /> : <FileText className="w-7 h-7" />}
                  {loading ? 'Analyse en cours...' : 'Analyser IA'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl border-blue-400 border-2 bg-white/70 w-full max-w-5xl mx-auto p-12 md:p-20 rounded-3xl backdrop-blur-xl animate-in fade-in zoom-in">
            <CardHeader className="flex flex-row items-center gap-6 pb-4">
              <FileText className="text-blue-700 w-10 h-10" />
              <div>
                <CardTitle className="text-4xl font-bold">Suggestion IA du dossier</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Relis et complète la suggestion proposée automatiquement ci-dessous.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Résumé suggestion IA */}
              <div>
                <span className="font-semibold text-xl">Objet :</span>
                <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.objet || <span className="italic text-gray-400">Non extrait</span>}</div>
              </div>
              <div>
                <span className="font-semibold text-xl">Objectif :</span>
                <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.objectif || <span className="italic text-gray-400">Non extrait</span>}</div>
              </div>
              <div>
                <span className="font-semibold text-xl">Faits principaux :</span>
                <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.faits || <span className="italic text-gray-400">Non extrait</span>}</div>
              </div>
              <div>
                <span className="font-semibold text-xl">Mots-clés :</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(suggestion.keywords || []).slice(0, 3).map((kw, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-base font-medium shadow-sm">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-xl">Résumé IA :</span>
                <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.resume || <span className="italic text-gray-400">Aucun résumé</span>}</div>
              </div>
              {suggestion.pointFort && (
                <div>
                  <span className="font-semibold text-xl">Point fort :</span>
                  <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.pointFort}</div>
                </div>
              )}
              {suggestion.pointFaible && (
                <div>
                  <span className="font-semibold text-xl">Point faible :</span>
                  <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.pointFaible}</div>
                </div>
              )}
              {suggestion.preuves && (
                <div>
                  <span className="font-semibold text-xl">Preuves :</span>
                  <div className="border p-4 rounded-lg bg-gray-50 my-2 text-base">{suggestion.preuves}</div>
                </div>
              )}
              {/* ==== Modules d'enrichissement IA sur la même page ==== */}
              <AjouterDecision dossier={suggestion} onNext={() => {}} />
              <AjouterLoiArticle dossier={suggestion} onNext={() => {}} />
              <GenererStrategie dossier={suggestion} onNext={() => {}} />
              {/* ==== Bouton de validation du dossier ==== */}
              {suggestion && !validated && (
                <button
                  type="button"
                  onClick={handleValider}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-bold mt-6 text-lg hover:bg-green-700 shadow"
                >
                  Valider le dossier
                </button>
              )}
              {validated && (
                <div className="text-green-700 text-center font-bold py-6 text-xl">
                  Dossier validé avec succès !
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
