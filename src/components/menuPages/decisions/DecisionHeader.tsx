// src/components/decisions/DecisionHeader.tsx
import { Search, FileText, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DecisionHeaderProps {
  localSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
}

export function DecisionHeader({
  localSearch,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: DecisionHeaderProps) {
  return (
    <header className="pb-6 border-b border-indigo-500 flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="bg-indigo-600 dark:bg-indigo-400 p-3 rounded-full">
          <FileText className="h-6 w-6 text-white dark:text-slate-900" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          Toutes les Décisions
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative flex items-center w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={localSearch}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-xl transition-shadow duration-200 shadow-md focus:shadow-lg"
          />
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => onViewModeChange("card")}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              viewMode === "card"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-500 hover:text-indigo-600"
            )}
            aria-label="Vue par cartes"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-500 hover:text-indigo-600"
            )}
            aria-label="Vue par tableau"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}