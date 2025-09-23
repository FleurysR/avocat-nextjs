// src/components/DecisionPage.tsx
"use client";

import React, { useState } from "react";
import { DecisionDetails } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import { FileText, Gavel, Users, Landmark } from "lucide-react";

interface DecisionPageProps {
  detailedDecision: DecisionDetails | null;
  loading: boolean;
  error: string | null;
}

export default function DecisionPage({
  detailedDecision,
  loading,
  error,
}: DecisionPageProps) {
  const [activeTab, setActiveTab] = useState("general");

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Gavel className="w-5 h-5 text-indigo-500" />
              Détails de la décision
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">Juridiction:</span> {detailedDecision?.juridiction?.designation || "-"}</p>
              <p><span className="font-semibold">Matière:</span> {detailedDecision?.matiere || "-"}</p>
              <p><span className="font-semibold">Formation Judiciaire:</span> {detailedDecision?.formationJudiciaire?.designation || "-"}</p>
              <p><span className="font-semibold">Chambre:</span> {detailedDecision?.chambre?.designation || "-"}</p>
              <p><span className="font-semibold">Président de Chambre:</span> {detailedDecision?.presidentChambre || "-"}</p>
              <p><span className="font-semibold">Date de la décision:</span> {detailedDecision?.decisionAt ? new Date(detailedDecision.decisionAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>
        );

      case "parties":
        return (
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Parties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold">Avocat Demandeur:</span> {detailedDecision?.avocatDemandeur || "-"}</p>
              <p><span className="font-semibold">Avocat Défenseur:</span> {detailedDecision?.avocatDefendeur || "-"}</p>
              <p><span className="font-semibold">Solution:</span> {detailedDecision?.solution?.designation || "-"}</p>
              {detailedDecision?.isSolutionTotal !== undefined && (
                <p><span className="font-semibold">Solution Totale:</span> {detailedDecision.isSolutionTotal ? "Oui" : "Non"}</p>
              )}
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-500" />
              Contenu
            </h3>
            <div className="space-y-4 text-sm">
              {detailedDecision?.principeJuridique && (
                <div>
                  <p className="font-semibold">Principe Juridique:</p>
                  <p className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700">{detailedDecision.principeJuridique}</p>
                </div>
              )}
              {detailedDecision?.keywords && detailedDecision.keywords.length > 0 && (
                <div>
                  <p className="font-semibold">Mots-clés:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {detailedDecision.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {detailedDecision?.anonymousContent && (
                <div>
                  <p className="font-semibold">Contenu Anonyme:</p>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 whitespace-pre-wrap">
                    {detailedDecision.anonymousContent}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : detailedDecision ? (
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-2">
                <FileText className="w-7 h-7" />
                {detailedDecision.objet || "Sans objet"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Décision n° {detailedDecision.numero} - Dossier n° {detailedDecision.numeroDossier}
              </p>
            </div>

            <div className="flex border-b border-gray-200 dark:border-slate-700">
              <button
                className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "general"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("general")}
              >
                Généralités
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "parties"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("parties")}
              >
                Parties
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "content"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("content")}
              >
                Contenu
              </button>
            </div>

            <div className="pt-4">
              {renderTabContent()}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>Aucune donnée de décision disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
}