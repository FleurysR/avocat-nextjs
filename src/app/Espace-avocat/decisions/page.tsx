"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useDecisions } from "@/hooks/decisions/useDecisions";
import { DecisionHeader, DecisionList } from "@/components/menuPages/decisions";

export default function DecisionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filters, setFilters] = useState({}); 

  const router = useRouter();

  const { decisions, loading, error, totalPages, totalHits } = useDecisions(localSearch, currentPage, filters);

  const handleSelectDecision = (code: string) => {
    // Le chemin doit inclure 'Espace-avocat' pour correspondre à votre structure de dossiers
    router.push(`/Espace-avocat/decisions/${code}`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-screen-xl">
        <DecisionHeader
          localSearch={localSearch}
          onSearchChange={(e) => {
            setLocalSearch(e.target.value);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="mt-6">
          {localSearch && (
            <p className="text-gray-700 dark:text-gray-300 text-center text-sm mt-2 mb-6">
              {totalHits} résultat{totalHits > 1 ? "s" : ""} pour « {localSearch} »
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 p-6 bg-red-100 dark:bg-red-900 rounded-xl shadow-inner">{error}</p>
          ) : decisions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center p-6">Aucune décision trouvée.</p>
          ) : (
            <DecisionList
              decisions={decisions}
              viewMode={viewMode}
              onSelect={handleSelectDecision}
              searchTerm={localSearch}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center sticky bottom-4 z-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}