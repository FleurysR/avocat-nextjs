"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchLoiArticles } from "@/services/client-api";
import { LoiArticle } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { SearchInput } from "@/components/context/SearchInput";

const PAGE_SIZE = 10;

// Fonction de mise en surbrillance des termes de recherche
const highlightText = (text: string, searchTerm: string): string | ReactNode[] => {
  if (!searchTerm || !text) return text;

  const parts: (string | ReactNode)[] = [];
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchedText = match[0];
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    parts.push(
      <strong key={startIndex} className="font-bold text-indigo-700 dark:text-indigo-400">
        {matchedText}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default function LoiEtArticlesPage() {
  const [articles, setArticles] = useState<LoiArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm } = useSearch();

  // Gestion de l'expansion des articles
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const toggleExpand = (code: string) => {
    setExpandedArticles(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Chargement des articles depuis l'API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const data = await fetchLoiArticles(searchTerm, PAGE_SIZE, offset);
        const fetchedArticles = Array.isArray(data.hits) ? data.hits : [];
        setArticles(fetchedArticles);
        setTotalItems(data.estimatedTotalHits || fetchedArticles.length);
        setTotalPages(Math.ceil((data.estimatedTotalHits || fetchedArticles.length) / PAGE_SIZE));
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || "Erreur lors de la récupération des articles.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, searchTerm]);

  useEffect(() => setCurrentPage(1), [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex-none">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-500 pb-2">
          📄 Loi et Articles
        </h1>
        <SearchInput />
        {searchTerm && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Vous avez {totalItems} résultat(s) pour votre recherche.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucun article trouvé.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {articles.map((article) => {
              const isExpanded = expandedArticles.includes(article.code);
              const truncatedContent = article.content.length > 150
                ? article.content.slice(0, 150) + "..."
                : article.content;

              return (
                <li
                  key={article.code}
                  className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:border-indigo-500 transition-all transform hover:scale-105"
                >
                  <h3 className="font-semibold text-md text-indigo-600 dark:text-indigo-300 mb-1">
                    {article.loi}
                  </h3>
                  <h2 className="font-semibold text-lg text-indigo-700 dark:text-indigo-400 mb-2">
                    📄 Article n° {article.numero}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">
                    {highlightText(isExpanded ? article.content : truncatedContent, searchTerm)}
                    {article.content.length > 150 && (
                      <button
                        onClick={() => toggleExpand(article.code)}
                        className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold"
                      >
                        {isExpanded ? "Lire moins" : "Lire plus"}
                      </button>
                    )}
                  </p>
                </li>
              );
            })}
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
