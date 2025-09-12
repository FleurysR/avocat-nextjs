// src/components/menuPages/juridictions/JuridictionCard.tsx
import { Juridiction } from "@/types";
import { ReactNode } from "react";
import { Scale } from "lucide-react";

// La fonction highlightText peut être un utilitaire partagé
const highlightText = (text: string, searchTerm: string): string | ReactNode[] => {
  if (!searchTerm || !text) return text;
  const parts: (string | ReactNode)[] = [];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const startIndex = match.index;
    if (startIndex > lastIndex) parts.push(text.substring(lastIndex, startIndex));
    parts.push(
      <strong key={startIndex} className="font-bold text-indigo-700 dark:text-indigo-400">
        {match[0]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts;
};

interface JuridictionCardProps {
  juridiction: Juridiction;
  searchTerm: string;
}

export function JuridictionCard({ juridiction, searchTerm }: JuridictionCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer">
      <div className="flex items-start gap-4 mb-2">
        <Scale className="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 leading-snug">
            {highlightText(juridiction.designation, searchTerm)}
          </h2>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {highlightText(juridiction.description, searchTerm)}
      </p>
    </div>
  );
}