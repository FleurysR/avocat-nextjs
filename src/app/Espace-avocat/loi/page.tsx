"use client";

import { useState, useEffect } from "react";
import { fetchLoiArticles } from "@/services/client-api";
import { LoiArticle } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { useDebounce } from "@/components/context/useDebounce";
import { SearchInput } from "@/components/context/SearchInput";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

// Fonction pour surligner les termes recherchés
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm || !text) return text;
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-600 font-semibold px-1 rounded">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default function LoiEtArticlesPage() {
  const { searchTerm } = useSearch();
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [articles, setArticles] = useState<LoiArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch des articles
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const data = await fetchLoiArticles(debouncedSearch, PAGE_SIZE, offset);
        setArticles(data.hits || []);
        setTotalItems(data.estimatedTotalHits || 0);
        setTotalPages(Math.ceil((data.estimatedTotalHits || 0) / PAGE_SIZE));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, debouncedSearch]);

  // Réinitialiser la page si la recherche change
  useEffect(() => setCurrentPage(1), [debouncedSearch]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-400">
        📄 Loi et Articles
      </h1>

      {/* Barre de recherche locale */}
      <div className="mb-4">
        <SearchInput placeholder="Rechercher un article spécifique..." />
      </div>

      {/* Compteur de résultats */}
      {debouncedSearch && totalItems > 0 && (
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {totalItems} résultat{totalItems > 1 ? "s" : ""} trouvé{totalItems > 1 ? "s" : ""} pour « {debouncedSearch} »
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner variant="ring" size={48} />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Aucun article trouvé.
        </p>
      ) : (
        <ul className="space-y-8">
          {articles.map((a) => (
            <ArticleCard key={a.code} article={a} search={debouncedSearch} />
          ))}
        </ul>
      )}

      {/* Pagination */}
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

// Composant pour chaque article
function ArticleCard({ article, search }: { article: LoiArticle; search: string }) {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 200;

  const content = article.content || "";
  const isLong = content.length > previewLength;
  const displayText = expanded ? content : content.slice(0, previewLength) + (isLong ? "..." : "");

  return (
    <li className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-200">
      <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mb-1">{article.loi}</h3>
      <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
        📄 Article n° {article.numero}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
        {highlightText(displayText, search)}
      </p>

      {isLong && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Voir moins" : "Voir plus"}
          </Button>
        </div>
      )}
    </li>
  );
}
