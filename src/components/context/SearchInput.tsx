"use client";

import { useSearch } from "./SearchContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; //  Importez la fonction 'cn'
import { SearchIcon } from "lucide-react"; //  Ajoutez cette ligne

interface SearchInputProps {
  placeholder?: string;
  className?: string; //  1. Ajoutez la propriété 'className'
}

export function SearchInput({ placeholder = "Rechercher...", className }: SearchInputProps) {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    //  2. Appliquez les classes au conteneur principal
    <div className={cn("relative flex items-center w-full", className)}>
      {/*  3. Ajoutez l'icône de recherche pour un meilleur design */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        //  Appliquez le style de l'input ici
        className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-xl transition-shadow duration-200 shadow-md focus:shadow-lg"
      />
    </div>
  );
}