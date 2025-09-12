// src/app/Espace-avocat/dossiers/page.tsx

"use client";

import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import DossierModal from "@/components/modals/DossierModal";

// Importez les composants et hooks nécessaires
import { useDossiers } from "@/hooks/dossiers/useDossiers";
import { useDossierDetails } from "@/hooks/dossiers/useDossierDetails";
import { DossierList } from "@/components/menuPages/dossiers/DossierList";
import { DossiersHeader } from "@/components/menuPages/dossiers/DossiersHeader";

export default function DossiersListPage() {
  const [currentPage, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedDossierCode, setSelectedDossierCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card"); // Nouvel état pour le mode de vue

  const { dossiers, loading, error, totalItems, totalPages } = useDossiers(localSearch, currentPage);
  const { detailedDossier, loadingDetails, errorDetails } = useDossierDetails(selectedDossierCode);

  const closeModal = () => {
    setSelectedDossierCode(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-screen-xl">
        <DossiersHeader
          localSearch={localSearch}
          onSearchChange={(e) => {
            setLocalSearch(e.target.value);
            setPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="mt-6">
          {localSearch && (
            <p className="text-gray-700 dark:text-gray-300 text-center mt-2 mb-6">
              {totalItems} résultat{totalItems > 1 ? "s" : ""} pour « {localSearch} »
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-medium my-8 p-4 bg-red-100 dark:bg-red-900 rounded-lg shadow-inner">
              {error}
            </div>
          ) : dossiers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 my-8">
              Aucun dossier trouvé.
            </div>
          ) : (
            <DossierList
              dossiers={dossiers}
              viewMode={viewMode}
              onSelect={setSelectedDossierCode}
              searchTerm={localSearch}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center sticky bottom-4 z-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>
      <DossierModal
        isOpen={!!selectedDossierCode}
        onClose={closeModal}
        detailedDossier={detailedDossier}
        loading={loadingDetails}
        error={errorDetails}
      />
    </div>
  );
}