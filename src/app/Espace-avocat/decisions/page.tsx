"use client";

import { useState, useMemo, useCallback } from "react"; 
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination"; 
import { Spinner } from "@/components/ui/shadcn-io/spinner"; 
import { useDecisions } from "@/hooks/decisions/useDecisions"; 
import { DecisionHeader, DecisionList } from "@/components/menuPages/decisions"; 
import { DecisionsFilters } from "@/types"; 

type ViewMode = "table" | "card";

export default function DecisionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  
  const [dateMin, setDateMin] = useState(""); 
  const [dateMax, setDateMax] = useState(""); 
  
  // NOUVEAU: État pour l'ordre de tri
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); 
  
  const router = useRouter();

  // Objet de filtres pour l'API (inclut le tri)
  const filters: DecisionsFilters = useMemo(() => ({
    date_min: dateMin,
    date_max: dateMax,
    sort_order: sortOrder, 
  }), [dateMin, dateMax, sortOrder]); 

  const { decisions, loading, error, totalPages, totalHits } = useDecisions(localSearch, currentPage, filters);

  const handleSelectDecision = (code: string) => {
    router.push(`/Espace-avocat/decisions/${code}`);
  };
  
  // Handler de tri (utilise useCallback)
  const handleSortChange = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
    setCurrentPage(1); 
  }, []);

  // Handler de recherche (utilise useCallback)
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setCurrentPage(1);
  }, []);
  
  // Handler de filtres de date (utilise useCallback)
  const handleDateFilterChange = useCallback((type: 'date_min' | 'date_max', value: string) => {
    if (type === 'date_min') {
      setDateMin(value);
    } else {
      setDateMax(value);
    }
    setCurrentPage(1);
  }, []);


  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-screen-xl">
        <DecisionHeader
          localSearch={localSearch}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          
          dateMin={dateMin}
          dateMax={dateMax}
          onDateChange={handleDateFilterChange}
          
          // L'AJOUT CRITIQUE pour corriger l'erreur:
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
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