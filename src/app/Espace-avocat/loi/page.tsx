// src/app/Espace-avocat/loi-et-articles/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearch } from "@/components/context/SearchContext";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Pagination } from "@/components/Pagination";

// Importez les nouveaux composants et hooks
import { useLoiArticles } from "@/hooks/loi-articles/useLoiArticles";
import { LoiArticleList } from "@/components/menuPages/loi-articles/LoiArticleList";
import { LoiArticleHeader } from "@/components/menuPages/loi-articles/LoiArticleHeader";

export default function LoiEtArticlesPage() {
  const { searchTerm, setSearchTerm } = useSearch(); // Utilisez setSearchTerm si nécessaire
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"card" | "list">("card"); // État pour le mode de vue

  // Utilise le hook personnalisé pour la logique de la page
  const { articles, totalPages, totalItems, loading, error } = useLoiArticles(searchTerm, currentPage);

  // Réinitialiser la page si la recherche change
  useEffect(() => setCurrentPage(1), [searchTerm]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <LoiArticleHeader
        localSearch={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {searchTerm && totalItems > 0 && (
        <p className="mb-6 text-gray-700 dark:text-gray-300 text-center">
          {totalItems} résultat{totalItems > 1 ? "s" : ""} trouvé{totalItems > 1 ? "s" : ""} pour « {searchTerm} »
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner variant="ring" size={48} />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 p-6 bg-red-100 dark:bg-red-900 rounded-xl shadow-inner">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Aucun article trouvé.
        </p>
      ) : (
        <LoiArticleList
          articles={articles}
          viewMode={viewMode}
          searchTerm={searchTerm}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
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