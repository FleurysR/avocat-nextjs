'use client';

import { useSearch } from "@/components/context/SearchContext";
import { Input } from "@/components/ui/input"; // Adaptez le chemin si nécessaire

export function SearchInput() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="mb-4">
      <Input
        type="search"
        placeholder="Rechercher par nom, matricule, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-md bg-white dark:bg-slate-800"
      />
    </div>
  );
}