"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GlobalSearchContextType {
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [globalSearch, setGlobalSearch] = useState("");
  return (
    <GlobalSearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </GlobalSearchContext.Provider>
  );
}
