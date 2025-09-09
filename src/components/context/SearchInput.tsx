"use client";

import { useSearch } from "./SearchContext";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string; // ✅ optionnel
}

export function SearchInput({ placeholder = "Rechercher..." }: SearchInputProps) {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="mb-4">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-md bg-white dark:bg-slate-800"
      />
    </div>
  );
}
