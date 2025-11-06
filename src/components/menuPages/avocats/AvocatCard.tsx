import { Avocat } from "@/types";
import { highlightText } from "@/components/utils/highlightText";
import { User, Phone, MapPin, Scale, Users } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

interface AvocatCardItemProps {
  avocat: Avocat;
  searchTerm: string;
  onClick: (code: string) => void;
}

export function AvocatCardItem({ avocat, searchTerm, onClick }: AvocatCardItemProps) {
  return (
    <div
      onClick={() => onClick(avocat.code)}
      className="relative p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer flex flex-col items-center gap-4 text-center"
    >
      {/* 🔹 Badge matricule élégant en haut à droite */}
      <div className="absolute top-2 right-2">
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full shadow-sm dark:text-gray-300 dark:bg-slate-700"
        >
          {avocat.matricule || "N/A"}
        </Badge>
      </div>

      <div className="flex-shrink-0">
        {/* HARMONISATION : Icône en Bleu Royal */}
        <User className="h-12 w-12 text-sidebar-primary dark:text-sidebar-primary/80" />
      </div>
      <div className="flex-1 min-w-0">
        {/* HARMONISATION : Titre en Bleu Royal */}
        <h2 className="text-xl font-semibold text-sidebar-primary dark:text-sidebar-primary/80 truncate">
          {highlightText(avocat.nom, searchTerm)} {highlightText(avocat.prenoms, searchTerm)}
        </h2>
        <div className="flex flex-col items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm mt-2">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{avocat.genre.designation || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{avocat.ville}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{avocat.phonePrincipal || "-"}</span>
          </div>
          {avocat.district && (
            <div className="flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{avocat.district.designation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}