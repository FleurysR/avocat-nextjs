"use client";

import React from "react";
import { AvocatDetails } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";

interface AvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailedAvocat: AvocatDetails | null;
  loading: boolean;
  error: string | null;
}

export default function AvocatModal({
  isOpen,
  onClose,
  detailedAvocat,
  loading,
  error,
}: AvocatModalProps) {
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
        ) : detailedAvocat ? (
          <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              {detailedAvocat.nom} {detailedAvocat.prenoms}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Matricule:</p>
                <p>{detailedAvocat.matricule}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{detailedAvocat.email}</p>
              </div>
              <div>
                <p className="font-semibold">Téléphone:</p>
                <p>{detailedAvocat.phonePrincipal || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Région:</p>
                <p>{detailedAvocat.region?.designation || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Ville:</p>
                <p>{detailedAvocat.ville || "N/A"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Année: {detailedAvocat.yearExercice}</Badge>
              <Badge variant="secondary">Genre: {detailedAvocat.genre?.designation}</Badge>
              {detailedAvocat.district && <Badge variant="secondary">District: {detailedAvocat.district.designation}</Badge>}
              {detailedAvocat.commune && <Badge variant="secondary">Commune: {detailedAvocat.commune.designation}</Badge>}
            </div>
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
