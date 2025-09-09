"use client";

import { useState, useEffect } from "react";
import { fetchDecisions, fetchDecisionByCode } from "@/services/client-api";
import { Decision, DecisionDetails } from "@/types";
import { useDebounce } from "@/components/context/useDebounce";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DecisionModal from "@/components/modals/DecisionModal";

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

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDecisionCode, setSelectedDecisionCode] = useState<string | null>(null);
  const [detailedDecision, setDetailedDecision] = useState<DecisionDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Recherche locale
  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 400);

  // Charger les décisions
  useEffect(() => {
    const loadDecisions = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * PAGE_SIZE;
        const data = await fetchDecisions(debouncedSearch, PAGE_SIZE, offset);
        setDecisions(data.hits || []);
        setTotalHits(data.estimatedTotalHits || 0);
        setTotalPages(Math.ceil((data.estimatedTotalHits || 0) / PAGE_SIZE));
      } catch {
        setError("Erreur lors de la récupération des décisions.");
      } finally {
        setLoading(false);
      }
    };
    loadDecisions();
  }, [currentPage, debouncedSearch]);

  // Charger les détails d'une décision
  useEffect(() => {
    const loadDecisionDetails = async () => {
      if (!selectedDecisionCode) return;
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const data = await fetchDecisionByCode(selectedDecisionCode);
        setDetailedDecision(data);
      } catch {
        setErrorDetails("Erreur lors de la récupération des détails.");
      } finally {
        setLoadingDetails(false);
      }
    };
    loadDecisionDetails();
  }, [selectedDecisionCode]);

  const closeModal = () => {
    setSelectedDecisionCode(null);
    setDetailedDecision(null);
    setErrorDetails(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-screen-xl">
        <header className="pb-6 border-b border-indigo-500">
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 text-center">
            Toutes les Décisions
          </h1>

          {/* Barre de recherche locale */}
          <div className="mt-4 flex justify-center">
            <Input
              type="search"
              placeholder="Rechercher par objet, dossier ou avocat..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full md:max-w-md bg-white dark:bg-slate-800"
            />
          </div>

          {/* Nombre de résultats */}
          {debouncedSearch && (
            <p className="text-gray-700 dark:text-gray-300 text-center mt-2">
              {totalHits} résultat{totalHits > 1 ? "s" : ""} pour « {debouncedSearch} »
            </p>
          )}
        </header>

        <main className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 p-6">{error}</p>
          ) : decisions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center p-6">Aucune décision trouvée.</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decisions.map((decision) => (
                <DecisionCard
                  key={decision.code}
                  decision={decision}
                  onSelect={() => setSelectedDecisionCode(decision.code)}
                  searchTerm={debouncedSearch}
                />
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center sticky bottom-4 z-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </main>
      </div>

      <DecisionModal
        isOpen={!!selectedDecisionCode}
        onClose={closeModal}
        detailedDecision={detailedDecision}
        loading={loadingDetails}
        error={errorDetails}
      />
    </div>
  );
}

// Composant Card pour chaque décision
function DecisionCard({
  decision,
  onSelect,
  searchTerm,
}: {
  decision: Decision;
  onSelect: () => void;
  searchTerm: string;
}) {
  const previewLength = 80;
  const objet = decision.objet || "Sans objet";
  const displayObjet = objet.length > previewLength ? objet.slice(0, previewLength) + "..." : objet;

  return (
    <li>
      <div
        onClick={onSelect}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
      >
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2 line-clamp-2">
          {highlightText(displayObjet, searchTerm)}
        </h2>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">Dossier n°: {decision.numeroDossier || "-"}</Badge>
          <Badge variant="secondary">
            Date: {decision.decisionAt ? new Date(decision.decisionAt).toLocaleDateString() : "-"}
          </Badge>
        </div>

        {/* Avocats sur des lignes séparées */}
        <div className="flex flex-col gap-2">
          <Badge
            variant="secondary"
            className="truncate"
            title={decision.avocatDemandeur || "-"}
          >
            Avocat Demandeur: {decision.avocatDemandeur || "-"}
          </Badge>

          <Badge
            variant="secondary"
            className="truncate"
            title={decision.avocatDefenseur || "-"}
          >
            Avocat Défenseur: {decision.avocatDefenseur || "-"}
          </Badge>
        </div>
      </div>
    </li>
  );
}
