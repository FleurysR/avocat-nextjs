// src/components/modals/DecisionModal.tsx
"use client";

import React from "react";
import { DecisionDetails } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailedDecision: DecisionDetails | null; 
  loading: boolean;
  error: string | null;
}

export default function DecisionModal({
  isOpen,
  onClose,
  detailedDecision,
  loading,
  error,
}: DecisionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : detailedDecision ? (
          <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              {detailedDecision.objet || "Sans objet"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Numéro Dossier:</p>
                <p>{detailedDecision.numeroDossier || "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Date Décision:</p>
                <p>{detailedDecision.decisionAt ? new Date(detailedDecision.decisionAt).toLocaleDateString() : "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Avocat Demandeur:</p>
                <p>{detailedDecision.avocatDemandeur || "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Avocat Défenseur:</p>
                <p>{detailedDecision.avocatDefendeur || "-"}</p>
              </div>
            </div>

            {detailedDecision.anonymousContent && (
              <div>
                <p className="font-semibold">Notes:</p>
                <p>{detailedDecision.anonymousContent}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>Aucune donnée disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
}
