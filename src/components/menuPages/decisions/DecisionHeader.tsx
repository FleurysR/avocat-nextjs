import { Search, FileText, Grid, List, Filter, ArrowDown, ArrowUp } from "lucide-react";
// Assurez-vous que ces chemins sont corrects dans votre structure de projet
import { Input } from "../../../components/ui/input"; 
import { cn } from "../../../lib/utils"; 
import { useState } from "react"; 

// Définition des propriétés attendues par le composant
interface DecisionHeaderProps {
  localSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Type corrigé
  viewMode: "table" | "card";
  onViewModeChange: (mode: "table" | "card") => void;
  
  // PROPS DE DATE
  dateMin: string;
  dateMax: string;
  onDateChange: (type: 'date_min' | 'date_max', value: string) => void;

  // PROPS DE TRI
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

// L'en-tête contient la barre de recherche, les boutons de mode d'affichage, 
// et le panneau de filtres avancé.
export function DecisionHeader({
  localSearch,
  onSearchChange,
  viewMode,
  onViewModeChange,
  dateMin,
  dateMax,
  onDateChange,
  sortOrder,
  onSortChange,
}: DecisionHeaderProps) {
    
  // État pour contrôler l'affichage du panneau de filtres
  const [showFilters, setShowFilters] = useState(false);

  // Classes de style communes
  const ACTIVE_BG = "bg-sidebar-primary text-white shadow"; 
  const SORT_BUTTON_CLASSES = "p-2 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium";

  return (
    <header className="pb-6 border-b border-gray-300 dark:border-slate-700 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        
        {/* BLOC 1: Titre et Icône */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Toutes les Décisions
          </h1>
          <div className="bg-sidebar-primary dark:bg-sidebar-primary/80 p-2 rounded-full hidden sm:block">
            <FileText className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
        </div>
      
        {/* BLOC 2: Contrôles (Recherche, Filtres, Vue) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            
            {/* Barre de recherche */}
            <div className="relative flex items-center w-full sm:w-64 md:w-80"> 
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <Input
                    type="search"
                    placeholder="Rechercher..."
                    value={localSearch}
                    onChange={onSearchChange}
                    className="w-full pl-10 pr-4 bg-white dark:bg-slate-800 rounded-full transition-all duration-200 shadow-sm focus:shadow-md focus:ring-2 focus:ring-sidebar-primary/50"
                />
            </div>
            
            {/* Boutons d'action : Filtre et Vue */}
            <div className="flex items-center space-x-2">
                {/* Bouton pour afficher/masquer les filtres */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "p-2 rounded-full transition-colors duration-200",
                        showFilters
                            ? ACTIVE_BG 
                            : "text-gray-500 hover:text-sidebar-primary"
                    )}
                    aria-label="Filtres avancés"
                >
                    <Filter className="h-5 w-5" />
                </button>
                
                {/* Boutons de mode d'affichage */}
                <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-full shadow-inner">
                    <button
                        onClick={() => onViewModeChange("table")}
                        className={cn(
                            "p-2 rounded-full transition-colors duration-200",
                            viewMode === "table"
                                ? ACTIVE_BG
                                : "text-gray-500 hover:text-sidebar-primary"
                        )}
                        aria-label="Vue par tableau"
                    >
                        <List className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("card")}
                        className={cn(
                            "p-2 rounded-full transition-colors duration-200",
                            viewMode === "card"
                                ? ACTIVE_BG
                                : "text-gray-500 hover:text-sidebar-primary"
                        )}
                        aria-label="Vue par cartes"
                    >
                        <Grid className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Panneau de filtres avancés (visible si showFilters est vrai) */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300">
          
          <div className="border-b border-gray-200 dark:border-slate-700 pb-2 mb-4">
              <h3 className="text-lg font-semibold text-sidebar-primary dark:text-sidebar-primary/80">
                Filtrage & Tri Avancé
              </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* BLOC 1: Filtrage par Date (2/3 de la largeur sur desktop) */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-r md:border-r-gray-200 md:dark:border-r-slate-700 md:pr-6">
                {/* Date Minimum */}
                <div>
                  <label htmlFor="date_min" className="block text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    id="date_min"
                    value={dateMin}
                    onChange={(e) => onDateChange('date_min', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-sidebar-primary"
                  />
                </div>
                
                {/* Date Maximum */}
                <div>
                  <label htmlFor="date_max" className="block text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    id="date_max"
                    value={dateMax}
                    onChange={(e) => onDateChange('date_max', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-sidebar-primary"
                  />
                </div>
            </div>

            {/* BLOC 2: Contrôle de Tri (1/3 de la largeur sur desktop) */}
            <div className="flex flex-col">
                <label className="block text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Trier par Date
                </label>
                <div className="flex space-x-2">
                    {/* Tri Descendant (Plus récent en premier) */}
                    <button
                        onClick={() => onSortChange('desc')}
                        className={cn(
                            SORT_BUTTON_CLASSES,
                            "flex-1",
                            sortOrder === "desc"
                                ? ACTIVE_BG
                                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        )}
                    >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Plus Récent
                    </button>
                    
                    {/* Tri Ascendant (Plus ancien en premier) */}
                    <button
                        onClick={() => onSortChange('asc')}
                        className={cn(
                            SORT_BUTTON_CLASSES,
                            "flex-1",
                            sortOrder === "asc"
                                ? ACTIVE_BG
                                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        )}
                    >
                        <ArrowUp className="h-4 w-4 mr-2" />
                        Plus Ancien
                    </button>
                </div>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
}