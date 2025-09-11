"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchAvocats, fetchAvocatDetails } from "@/services/client-api";
import { Avocat, AvocatDetails, AvocatsApiResponse } from "@/types";
import { useSearch } from "@/components/context/SearchContext";
import { useDebounce } from "@/components/context/useDebounce";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import AvocatModal from "@/components/modals/AvocatModal";
import { SearchInput } from "@/components/context/SearchInput";
import { toast } from "sonner";
import { FileText } from "lucide-react";

const PAGE_SIZE = 10;

// Fonction pour mettre en surbrillance le texte correspondant à la recherche
const highlightText = (text: string, searchTerm: string): string | ReactNode[] => {
  if (!searchTerm || !text) return text;

  const parts: (string | ReactNode)[] = [];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    parts.push(
      <strong key={startIndex} className="font-bold text-indigo-700 dark:text-indigo-400">
        {match[0]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default function AvocatsPage() {
  const [avocats, setAvocats] = useState<Avocat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAvocatCode, setSelectedAvocatCode] = useState<string | null>(null);
  const [detailedAvocat, setDetailedAvocat] = useState<AvocatDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const { searchTerm } = useSearch();
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Charger la liste des avocats
  useEffect(() => {
    const loadAvocats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: AvocatsApiResponse = await fetchAvocats(debouncedSearch, PAGE_SIZE, currentPage);
        const fetchedAvocats = Array.isArray(data.member) ? data.member : [];
        setAvocats(fetchedAvocats);
        setTotalItems(data.totalItems || fetchedAvocats.length);
        setTotalPages(Math.ceil((data.totalItems || fetchedAvocats.length) / PAGE_SIZE));
      } catch (err: unknown) {
        setError("Erreur lors de la récupération des avocats.");
        toast.error("Échec du chargement des avocats.");
      } finally {
        setLoading(false);
      }
    };
    loadAvocats();
  }, [currentPage, debouncedSearch]);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Charger les détails d'un avocat sélectionné
  useEffect(() => {
    const loadAvocatDetails = async () => {
      if (!selectedAvocatCode) return;
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const data = await fetchAvocatDetails(selectedAvocatCode);
        setDetailedAvocat(data);
      } catch (err: unknown) {
        setErrorDetails("Erreur lors de la récupération des détails.");
        toast.error("Échec du chargement des détails de l'avocat.");
      } finally {
        setLoadingDetails(false);
      }
    };
    loadAvocatDetails();
  }, [selectedAvocatCode]);

  const closeModal = () => {
    setSelectedAvocatCode(null);
    setDetailedAvocat(null);
    setErrorDetails(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex-none">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-500 pb-2 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          ⚖️ Tous les Avocats
        </h1>

        <SearchInput placeholder="Rechercher par nom, prénom ou téléphone..." />

        {debouncedSearch && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {totalItems} résultat{totalItems > 1 ? "s" : ""} pour votre recherche.
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
        ) : avocats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">Aucun avocat trouvé.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avocats.map((avocat) => (
              <li key={avocat.code}>
                <div
                  onClick={() => setSelectedAvocatCode(avocat.code)}
                  className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2 truncate">
                    {highlightText(avocat.nom, debouncedSearch)} {highlightText(avocat.prenoms, debouncedSearch)}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">Matricule: {avocat.matricule}</Badge>
                    <Badge variant="secondary">Ville: {avocat.ville}</Badge>
                    <Badge variant="secondary">Genre: {avocat.genre.designation}</Badge>
                    
                    {/* MODIFICATION : Ajout des badges pour le district et la région */}
                    {avocat.district && (
                      <Badge variant="secondary">District: {avocat.district.designation}</Badge>
                    )}
                    {avocat.region && (
                      <Badge variant="secondary">Région: {avocat.region.designation}</Badge>
                    )}
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Téléphone: {avocat.phonePrincipal || "-"}
                  </p>
                </div>
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

      {/* Modal Avocat */}
      <AvocatModal
        isOpen={!!selectedAvocatCode}
        onClose={closeModal}
        detailedAvocat={detailedAvocat}
        loading={loadingDetails}
        error={errorDetails}
      />
    </div>
  );
}