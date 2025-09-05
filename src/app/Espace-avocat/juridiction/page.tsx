"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchJuridictions } from "@/services/client-api";
import { Juridiction, JuridictionsApiResponse } from "@/types";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { SearchInput } from "@/components/context/SearchInput";
import { useSearch } from "@/components/context/SearchContext";

const PAGE_SIZE = 5;

const highlightText = (text: string, searchTerm: string): string | ReactNode[] => {
  if (!searchTerm || !text) return text;

  const parts: (string | ReactNode)[] = [];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const startIndex = match.index;
    if (startIndex > lastIndex) parts.push(text.substring(lastIndex, startIndex));

    parts.push(
      <strong key={startIndex} className="font-bold text-indigo-700 dark:text-indigo-400">
        {match[0]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts;
};

export default function JuridictionsPage() {
  const [juridictions, setJuridictions] = useState<Juridiction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utilisation du contexte pour le searchTerm
  const { searchTerm } = useSearch();

  // Réinitialiser la page quand la recherche change
  useEffect(() => setCurrentPage(1), [searchTerm]);

  // Charger les juridictions depuis l'API
  useEffect(() => {
    const loadJuridictions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: JuridictionsApiResponse = await fetchJuridictions(searchTerm, PAGE_SIZE, currentPage);
        setJuridictions(data.member || []);
        setTotalItems(data.totalItems || 0);
        setTotalPages(Math.ceil((data.totalItems || 0) / PAGE_SIZE));
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des juridictions.");
        setJuridictions([]);
      } finally {
        setLoading(false);
      }
    };

    loadJuridictions();
  }, [searchTerm, currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex-none">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-500 pb-2">
          ⚖️ Juridictions
        </h1>

        {/* SearchInput connecté au contexte */}
        <SearchInput />

        {searchTerm && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {totalItems} résultat(s) pour votre recherche.
          </p>
        )}
      </div>

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
              <li
                key={j.code}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                  {highlightText(j.designation, searchTerm)}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {highlightText(j.description, searchTerm)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex-none mt-4 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
