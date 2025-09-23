// src/components/DecisionDetailsPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import DetailItem from "@/components/DetailItem";
import { ChevronDownIcon, ClipboardDocumentIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface DetailedDecision {
  objet?: string;
  numero?: string;
  numeroDossier?: string;
  juridiction?: { designation: string };
  matiere?: string;
  decisionAt?: string;
  principeJuridique?: string;
  keywords?: string[];
  anonymousContent?: string;
  realContent?: string;
  contextualTerms?: string[];
  formationJudiciaire?: { designation: string };
  chambre?: { designation: string };
  presidentChambre?: string;
  nomDemandeur?: string;
  nomDefendeur?: string;
  avocatDemandeur?: string;
  avocatDefendeur?: string;
  solution?: { designation: string };
  isSolutionTotal?: boolean;
}

interface DecisionDetailsPageProps {
  detailedDecision: DetailedDecision | null;
  loading: boolean;
  error: string | null;
}

export default function DecisionDetailsPage({
  detailedDecision,
  loading,
  error,
}: DecisionDetailsPageProps) {
  const [contentVisible, setContentVisible] = useState(false);
  const router = useRouter();

  const formattedDate = detailedDecision?.decisionAt
    ? new Date(detailedDecision.decisionAt).toLocaleDateString("fr-FR", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "-";

  if (loading) return <p className="p-8 text-center text-gray-700 dark:text-gray-300">Chargement de la décision...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!detailedDecision) return <p className="p-8 text-center text-gray-500">Aucune décision trouvée.</p>;

  const copyToClipboard = (text: string | undefined) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Principe juridique copié dans le presse-papiers !");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sticky Header avec Bouton de retour */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 shadow-md py-4 px-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
            aria-label="Retour à la page précédente"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 truncate">
            {detailedDecision.objet || "Décision sans objet"}
          </h1>
        </div>
      </header>

      {/* Contenu principal de la décision */}
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Titre et numéros de la décision */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Décision n° {detailedDecision.numero}
          </p>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Dossier n° {detailedDecision.numeroDossier}
          </p>
        </div>

        {/* Grille d'informations en deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations clés */}
          <div className="lg:col-span-1 space-y-8">
            {/* Section Généralités */}
            <section className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 pb-2">Généralités</h2>
              <ul>
                <DetailItem label="Juridiction" value={detailedDecision.juridiction?.designation} />
                <DetailItem label="Matière" value={detailedDecision.matiere} />
                <DetailItem label="Date de la décision" value={formattedDate} />
                <DetailItem label="Formation Judiciaire" value={detailedDecision.formationJudiciaire?.designation} />
                <DetailItem label="Chambre" value={detailedDecision.chambre?.designation} />
                <DetailItem label="Président de Chambre" value={detailedDecision.presidentChambre} />
              </ul>
            </section>

            {/* Section Parties */}
            <section className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 pb-2">Parties</h2>
              <ul>
                <DetailItem label="Demandeur" value={detailedDecision.nomDemandeur} />
                <DetailItem label="Avocat Demandeur" value={detailedDecision.avocatDemandeur} />
                <DetailItem label="Défendeur" value={detailedDecision.nomDefendeur} />
                <DetailItem label="Avocat Défendeur" value={detailedDecision.avocatDefendeur} />
                <DetailItem label="Solution" value={detailedDecision.solution?.designation} />
                <DetailItem
                  label="Solution Totale"
                  value={detailedDecision.isSolutionTotal !== undefined ? (detailedDecision.isSolutionTotal ? "Oui" : "Non") : "-"}
                />
              </ul>
            </section>
          </div>

          {/* Colonne de droite - Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Principe Juridique et Actions */}
            {detailedDecision.principeJuridique && (
              <section className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Principe Juridique</h2>
                  <button
                    onClick={() => copyToClipboard(detailedDecision.principeJuridique)}
                    className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                    aria-label="Copier le principe juridique"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    <span>Copier</span>
                  </button>
                </div>
                <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">{detailedDecision.principeJuridique}</p>
              </section>
            )}

            {/* Section Contenu Complet (avec accordéon) */}
            {detailedDecision.realContent && (
              <section className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setContentVisible(!contentVisible)}>
                  <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Contenu Complet</h2>
                  <ChevronDownIcon className={`h-6 w-6 transform transition-transform ${contentVisible ? 'rotate-180' : 'rotate-0'}`} />
                </div>
                {contentVisible && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap transition-all duration-300 ease-in-out">
                    {detailedDecision.realContent}
                  </div>
                )}
              </section>
            )}

            {/* Section Mots-clés & Termes Contextuels */}
            <section className="bg-white dark:bg-slate-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 pb-2">Mots-clés & Termes</h2>
              {(detailedDecision.keywords && detailedDecision.keywords.length > 0) && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Mots-clés:</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailedDecision.keywords.map((k, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-sm font-medium transition-colors">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              {(detailedDecision.contextualTerms && detailedDecision.contextualTerms.length > 0) && (
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Termes Contextuels:</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailedDecision.contextualTerms.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-sm font-medium transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}