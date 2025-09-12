// src/app/Espace-avocat/juridictions/page.tsx
"use client";

import { useJuridictionsData } from "@/hooks/juridictions/useJuridictionsData";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { SearchInput } from "@/components/context/SearchInput";
// import { Scale } from "lucide-react";
import { JuridictionCard } from "@/components/menuPages/juridictions/JuridictionCard";

export default function JuridictionsPage() {
  const {
    juridictions,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    loading,
    error,
    searchTerm,
  } = useJuridictionsData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b-2 border-indigo-500">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-4 md:mb-0">
          {/* <Scale className="h-8 w-8" /> */}
          ⚖️ Juridictions
        </h1>
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <SearchInput placeholder="Rechercher une juridiction..." className="w-full md:w-auto" />
        </div>
      </header>

      {searchTerm && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {totalItems} résultat(s) pour votre recherche.
        </p>
      )}

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : juridictions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            Aucune juridiction trouvée.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {juridictions.map((j) => (
              <li key={j.code}>
                <JuridictionCard juridiction={j} searchTerm={searchTerm} />
              </li>
            ))}
          </ul>
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