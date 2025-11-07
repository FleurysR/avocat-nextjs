// src/app/Espace-avocat/avocatList/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAvocatsData } from "@/hooks/avocats/useAvocatsData";
import { useGlobalSearch } from "@/components/context/GlobalSearchContext"; // 💡 NOUVEL IMPORT
import { AvocatsGrid } from "@/components/menuPages/avocats/AvocatsGrid";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { LocalSearchInput } from "@/components/context/LocalSearchInput"; 
import { FileText, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

function AvocatsListPage() { 
  const router = useRouter();
  
  // 💡 NETTOYAGE DU CONTEXTE GLOBAL
  const { setGlobalSearch } = useGlobalSearch();
  useEffect(() => {
    // Réinitialise la recherche globale au montage de la page
    setGlobalSearch(''); 
  }, [setGlobalSearch]);


  // Récupération des états LOCAUX (maintenant isolés)
  const {
    avocats,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    searchTerm, 
    setSearchTerm, 
    debouncedSearch,
    sortField, 
    sortOrder, 
    onSortChange, 
  } = useAvocatsData(); 

  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const handleAvocatClick = (code: string) => {
    router.push(`/Espace-avocat/avocatList/${code}`);
  };

  const sidebarPrimaryBg = "bg-sidebar-primary"; 
  const sidebarPrimaryText = "text-sidebar-primary";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-sidebar-primary dark:border-indigo-400">
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-indigo-400 flex items-center gap-2 mb-4 sm:mb-0">
          <FileText className="h-8 w-8" />
          ⚖️ Tous les Avocats
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          
          {/* L'input local utilise les états LOCAUX de useAvocatsData */}
          <LocalSearchInput 
            placeholder="Rechercher par nom, prénom..." 
            className="w-full sm:w-auto md:w-[250px]"
            value={searchTerm} 
            onChange={setSearchTerm}
          />
          
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner flex-shrink-0">
            {/* Bouton LISTE */}
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                viewMode === "list"
                  ? `${sidebarPrimaryBg} text-white shadow-md`
                  : `text-gray-500 hover:${sidebarPrimaryText} dark:text-gray-400 dark:hover:text-indigo-400`
              )}
              aria-label="Vue par liste"
            >
              <List className="h-5 w-5" />
            </button>
            {/* Bouton CARTE */}
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                viewMode === "card"
                  ? `${sidebarPrimaryBg} text-white shadow-md`
                  : `text-gray-500 hover:${sidebarPrimaryText} dark:text-gray-400 dark:hover:text-indigo-400`
              )}
              aria-label="Vue par cartes"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {debouncedSearch && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          **{totalItems}** résultat{totalItems > 1 ? "s" : ""} pour votre recherche.
        </p>
      )}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner variant="ring" size={48} className="text-sidebar-primary dark:text-indigo-400" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <AvocatsGrid
            avocats={avocats}
            searchTerm={debouncedSearch}
            onAvocatClick={handleAvocatClick}
            viewMode={viewMode}
            sortField={sortField} 
            sortOrder={sortOrder} 
            onSortChange={onSortChange} 
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
    </div>
  );
}

export default AvocatsListPage;