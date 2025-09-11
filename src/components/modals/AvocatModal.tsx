"use client";

import React from "react";
import { AvocatDetails } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, IdCard, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 ease-out">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Fermer le modal"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : detailedAvocat ? (
          <div className="p-8 space-y-6 text-gray-700 dark:text-gray-300">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                {detailedAvocat.nom} {detailedAvocat.prenoms}
              </h2>
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                Matricule: {detailedAvocat.matricule}
              </Badge>
            </div>

            {/* Sections d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations de contact */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-indigo-500" />
                  Coordonnées
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{detailedAvocat.email || "Non spécifié"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>{detailedAvocat.phonePrincipal || "Non spécifié"}</span>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  Localisation
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Région:</span> {detailedAvocat.region?.designation || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ville:</span> {detailedAvocat.ville || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Commune:</span> {detailedAvocat.commune?.designation || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges de détails professionnels */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Détails professionnels
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 px-3 py-1">
                  Année d'exercice: {detailedAvocat.yearExercice}
                </Badge>
                {detailedAvocat.genre && !Array.isArray(detailedAvocat.genre) && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 px-3 py-1">
                    Genre: {detailedAvocat.genre.designation}
                  </Badge>
                )}
                {detailedAvocat.district && (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-3 py-1">
                    District: {detailedAvocat.district.designation}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>Aucune donnée disponible pour cet avocat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
