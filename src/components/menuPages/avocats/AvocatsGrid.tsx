// src/components/menuPages/avocats/AvocatsGrid.tsx

import { Avocat } from "@/types";
import { AvocatCardItem } from "./AvocatCard"; // ✅ Correct import
import { AvocatListItem } from "./AvocatListItem"; // 🆕 Import du nouveau composant

interface AvocatsGridProps {
  avocats: Avocat[];
  searchTerm: string;
  onAvocatClick: (code: string) => void;
  viewMode: "card" | "list"; // 🆕 Nouvelle prop
}

export function AvocatsGrid({ avocats, searchTerm, onAvocatClick, viewMode }: AvocatsGridProps) {
  if (avocats.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">Aucun avocat trouvé.</p>
    );
  }

  // 🆕 Rendu conditionnel
  if (viewMode === "list") {
    return (
      <ul className="space-y-4">
        {avocats.map((avocat) => (
          <li key={avocat.code}>
            <AvocatListItem avocat={avocat} searchTerm={searchTerm} onClick={onAvocatClick} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {avocats.map((avocat) => (
        <li key={avocat.code}>
          <AvocatCardItem avocat={avocat} searchTerm={searchTerm} onClick={onAvocatClick} />
        </li>
      ))}
    </ul>
  );
}