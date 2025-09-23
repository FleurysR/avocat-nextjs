import { Avocat } from "@/types";
import { highlightText } from "@/components/utils/highlightText";
// L'icône 'Gender' est remplacée par 'Users' qui est plus stable et représente un groupe de personnes
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
      {/* 🔹 Badge matricule en haut droit */}
      <div className="absolute top-2 right-2">
        <Badge variant="secondary" className="px-2 py-1 text-xs">
          {avocat.matricule || "N/A"}
        </Badge>
      </div>

      <div className="flex-shrink-0">
        <User className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 truncate">
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
          {/* L'icône de téléphone est remplacée par l'icône 'Users' */}
          
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