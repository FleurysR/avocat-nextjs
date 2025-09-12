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
    <header className="pb-6 border-b border-gray-300 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Toutes les Décisions
        </h1>
        <div className="bg-indigo-500 dark:bg-indigo-400 p-2 rounded-full hidden sm:block">
          <FileText className="h-5 w-5 text-white dark:text-slate-900" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative flex items-center w-full sm:w-auto">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={localSearch}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-full transition-all duration-200 shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-full shadow-inner">
          <button
            onClick={() => onViewModeChange("card")}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              viewMode === "card"
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-500 hover:text-indigo-500"
            )}
            aria-label="Vue par cartes"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={cn(
              "p-2 rounded-full transition-colors duration-200",
              viewMode === "table"
                ? "bg-indigo-500 text-white shadow"
                : "text-gray-500 hover:text-indigo-500"
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