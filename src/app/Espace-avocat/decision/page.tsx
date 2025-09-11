"use client";

import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import DecisionModal from "@/components/modals/DecisionModal";
// Les hooks personnalisés pour la logique métier des décisions
import { useDecisions } from "@/hooks/decisions/useDecisions";
import { useDecisionDetails } from "@/hooks/decisions/useDecisionDetails";
// Les composants d'affichage pour la page des décisions
import { DecisionHeader, DecisionList } from "@/components/menuPages/decisions";

// Composant principal de la page des décisions
export default function DecisionsPage() {
  // Déclare les variables d'état (state) pour le composant
  const [currentPage, setCurrentPage] = useState(1); // Gère le numéro de la page actuelle
  const [localSearch, setLocalSearch] = useState(""); // Stocke la valeur saisie dans la barre de recherche
  const [viewMode, setViewMode] = useState<"card" | "table">("card"); // Gère le mode d'affichage (cartes ou tableau)
  const [selectedDecisionCode, setSelectedDecisionCode] = useState<string | null>(null); // Stocke le code de la décision sélectionnée pour la modale

  // Utilise le hook useDecisions pour obtenir les données en fonction de la recherche et de la pagination
  const { decisions, loading, error, totalPages, totalHits } = useDecisions(localSearch, currentPage);
  
  // Utilise le hook useDecisionDetails pour récupérer les informations détaillées d'une décision spécifique
  const { detailedDecision, loadingDetails, errorDetails } = useDecisionDetails(selectedDecisionCode);
  const closeModal = () => {
    setSelectedDecisionCode(null);
  };

  // Le rendu du composant
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-screen-xl">
        {/* En-tête de la page avec la barre de recherche et les options de vue */}
        <DecisionHeader
          localSearch={localSearch}
          onSearchChange={(e) => {
            setLocalSearch(e.target.value);
            setCurrentPage(1); // Réinitialise la pagination à la première page lors d'une nouvelle recherche
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="mt-6">
          {/* Affiche le nombre de résultats si une recherche est en cours */}
          {localSearch && (
            <p className="text-gray-700 dark:text-gray-300 text-center text-sm mt-2 mb-6">
              {totalHits} résultat{totalHits > 1 ? "s" : ""} pour « {localSearch} »
            </p>
          )}

          {/* Affichage conditionnel des différentes sections */}
          {loading ? (
            // Affiche un spinner pendant le chargement des données
            <div className="flex items-center justify-center min-h-[300px]">
              <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : error ? (
            // Affiche un message d'erreur si la récupération des données échoue
            <p className="text-center text-red-500 p-6 bg-red-100 dark:bg-red-900 rounded-xl shadow-inner">{error}</p>
          ) : decisions.length === 0 ? (
            // Affiche un message si aucune décision n'est trouvée
            <p className="text-gray-500 dark:text-gray-400 text-center p-6">Aucune décision trouvée.</p>
          ) : (
            // Affiche la liste des décisions (cartes ou tableau)
            <DecisionList
              decisions={decisions}
              viewMode={viewMode}
              onSelect={setSelectedDecisionCode}
              searchTerm={localSearch}
            />
          )}

          {/* Affiche les contrôles de pagination si plus d'une page existe */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center sticky bottom-4 z-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </main>
      </div>

      {/* Affiche la modale si une décision est sélectionnée */}
      <DecisionModal
        isOpen={!!selectedDecisionCode} // Ouvre la modale si selectedDecisionCode n'est pas null
        onClose={closeModal}
        detailedDecision={detailedDecision}
        loading={loadingDetails}
        error={errorDetails}
      />
    </div>
  );
}