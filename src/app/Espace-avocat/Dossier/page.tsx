"use client";

import { useState, useEffect } from "react";
import { fetchDossiers } from "@/services/client-api";
import { Dossier } from "@/types";
import { Search, ArrowLeft, ArrowRight, FilePlus, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function DossiersListPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDossiers(query, ITEMS_PER_PAGE, page);
        
        // Trie les dossiers par date de création, du plus ancien au plus récent
        const sortedDossiers = data?.data.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        setDossiers(sortedDossiers || []);
        setTotalItems(data?.totalCount || 0);
      } catch (err) {
        setError("Impossible de charger les dossiers. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <FileText className="inline-block w-8 h-8 mr-2 text-indigo-500" />
          Liste des dossiers
        </h1>
        <Link href="/Espace-avocat/dossiers/creer">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors duration-200">
            <FilePlus className="h-5 w-5" />
            Créer un nouveau dossier
          </button>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6 flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-3 shadow-sm transition-colors duration-200">
        <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Rechercher par objet ou code..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Affichage conditionnel des états de chargement et d'erreur */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-500 dark:border-indigo-400"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium my-8 p-4 bg-red-100 dark:bg-red-900 rounded-lg shadow-inner">
          {error}
        </div>
      ) : (
        <>
          {dossiers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-md">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Objet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Créé le
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                  {dossiers.map((dossier) => (
                    <tr key={dossier.code} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-150">
                      
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {dossier.objet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(dossier.createdAt), "dd MMMM yyyy", { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 my-8">
              Aucun dossier trouvé.
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
