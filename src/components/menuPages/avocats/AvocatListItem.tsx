"use client";

import { Avocat } from "@/types";
import { highlightText } from "@/components/utils/highlightText";
import { User, Phone, MapPin, Scale } from "lucide-react";

interface AvocatListItemProps {
  avocat: Avocat;
  searchTerm: string;
  onClick: (code: string) => void;
}

export function AvocatListItem({ avocat, searchTerm, onClick }: AvocatListItemProps) {
  return (
    <tr
      onClick={() => onClick(avocat.code)}
      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <div className="flex-1 truncate">
            {highlightText(avocat.nom, searchTerm)} {highlightText(avocat.prenoms, searchTerm)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <span className="truncate">{avocat.ville}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <span className="truncate">{avocat.phonePrincipal || "-"}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        {avocat.district && (
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="truncate">{avocat.district.designation}</span>
          </div>
        )}
      </td>
    </tr>
  );
}