// src/app/Espace-avocat/loi-et-articles/page.tsx

"use client";

import { useState } from "react";
import { useAvocatsData } from "@/hooks/avocats/useAvocatsData";
import { useAvocatModal } from "@/hooks/avocats/useAvocatModal";
import { AvocatsGrid } from "@/components/menuPages/avocats/AvocatsGrid";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import AvocatModal from "@/components/modals/AvocatModal";
import { SearchInput } from "@/components/context/SearchInput";
import { FileText, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvocatsPage() {
  const {
    avocats,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    debouncedSearch,
  } = useAvocatsData();

  const {
    selectedAvocatCode,
    detailedAvocat,
    loadingDetails,
    errorDetails,
    openModal,
    closeModal,
  } = useAvocatModal();

  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      {/* 🚀 En-tête amélioré pour un alignement et un design parfaits */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-indigo-500">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-4 sm:mb-0">
          <FileText className="h-8 w-8" />
          ⚖️ Tous les Avocats
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Le composant SearchInput gère maintenant sa propre largeur */}
          <SearchInput placeholder="Rechercher par nom, prénom..." className="w-full sm:w-auto md:w-[250px]" />
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner flex-shrink-0">
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                viewMode === "card"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:text-indigo-600"
              )}
              aria-label="Vue par cartes"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:text-indigo-600"
              )}
              aria-label="Vue par liste"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {debouncedSearch && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {totalItems} résultat{totalItems > 1 ? "s" : ""} pour votre recherche.
        </p>
      )}

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <AvocatsGrid
            avocats={avocats}
            searchTerm={debouncedSearch}
            onAvocatClick={openModal}
            viewMode={viewMode}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex-none mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <AvocatModal
        isOpen={!!selectedAvocatCode}
        onClose={closeModal}
        detailedAvocat={detailedAvocat}
        loading={loadingDetails}
        error={errorDetails}
      />
    </div>
  );
}