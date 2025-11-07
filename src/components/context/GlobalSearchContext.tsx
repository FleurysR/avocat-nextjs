// src/components/context/GlobalSearchContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// --- 1. Définition du Type ---
interface GlobalSearchContextType {
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
}

// --- 2. Création du Contexte ---
const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

// --- 3. Hook Personnalisé (Consumer) ---
// 💡 Correction : Ajout de 'export'
export function useGlobalSearch() { 
  const context = useContext(GlobalSearchContext);
  if (!context) {
    // Ce message d'erreur est essentiel pour les développeurs
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}

// --- 4. Composant Fournisseur (Provider) ---
// 💡 Correction : Ajout de 'export'
export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [globalSearch, setGlobalSearch] = useState("");
  
  return (
    <GlobalSearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </GlobalSearchContext.Provider>
  );
}