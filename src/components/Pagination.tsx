import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const PAGES_PER_GROUP = 3;
  const currentGroup = Math.floor((currentPage - 1) / PAGES_PER_GROUP);
  const startPage = currentGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePrevGroup = () => {
    onPageChange(startPage - 1);
  };

  const handleNextGroup = () => {
    onPageChange(endPage + 1);
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* Bouton "Précédent" */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded bg-indigo-500 text-white disabled:bg-gray-300"
      >
        Précédent
      </button>

      {/* Bouton pour revenir au groupe précédent */}
      {startPage > 1 && (
        <button
          onClick={handlePrevGroup}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          ...
        </button>
      )}

      {/* Les boutons de page du groupe actuel */}
      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded ${
            currentPage === pageNumber
              ? "bg-indigo-700 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Bouton pour avancer au groupe suivant */}
      {endPage < totalPages && (
        <button
          onClick={handleNextGroup}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          ...
        </button>
      )}

      {/* Bouton "Suivant" */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded bg-indigo-500 text-white disabled:bg-gray-300"
      >
        Suivant
      </button>
    </div>
  );
}