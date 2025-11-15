// CHEMIN : /app/Espace-avocat/dossiers/page.tsx

"use client";

import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { useDossiers } from "@/hooks/dossiers/useDossiers";
import { DossierList } from "@/components/menuPages/dossiers/DossierList";
import { DossiersHeader } from "@/components/menuPages/dossiers/DossiersHeader";
import { FileSearch } from "lucide-react"; // Nouvelle icône pour l'état vide

export default function DossiersListPage() {
  const [currentPage, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  const { dossiers, loading, error, totalItems, totalPages } = useDossiers(localSearch, currentPage);

  return (
    // Conteneur principal avec une couleur de fond subtile
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* En-tête de la page */}
        <DossiersHeader
          localSearch={localSearch}
          onSearchChange={(e) => {
            setLocalSearch(e.target.value);
            setPage(1); // Réinitialiser la page à chaque nouvelle recherche
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalItems={totalItems} // Passer le nombre total pour l'affichage
        />

        {/* Contenu principal */}
        <main className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
              <Spinner variant="ring" size={48} className="text-indigo-500" />
              <p className="mt-4 text-lg font-medium">Chargement des dossiers...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-medium my-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-inner border border-red-200 dark:border-red-800">
              <p>Erreur lors du chargement des dossiers.</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : dossiers.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center text-gray-500 dark:text-gray-400">
                <FileSearch className="h-16 w-16 mb-4 text-gray-400" />
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Aucun dossier trouvé</h3>
                <p className="mt-2 max-w-md">
                    {localSearch 
                        ? `Votre recherche pour "${localSearch}" n'a donné aucun résultat. Essayez avec d'autres termes.`
                        : "Vous n'avez pas encore de dossiers. Créez-en un pour commencer."
                    }
                </p>
            </div>
          ) : (
            <DossierList
              dossiers={dossiers}
              viewMode={viewMode}
              searchTerm={localSearch}
            />
          )}

          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
