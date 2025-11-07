"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React from 'react';

interface LocalSearchInputProps {
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  className?: string;
}

/**
 * Composant d'entrée de recherche découplé du contexte global.
 * Il utilise l'état géré par le hook parent (useAvocatsData).
 */
export function LocalSearchInput({ value, onChange, placeholder = "Rechercher...", className }: LocalSearchInputProps) {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      {/* Icône de loupe */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
      
      {/* Le champ Input de Shadcn/ui */}
      <Input
        type="search"
        placeholder={placeholder}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-xl transition-shadow duration-200 shadow-md focus:shadow-lg focus:ring-2 focus:ring-sidebar-primary focus:border-sidebar-primary"
      />
    </div>
  );
}