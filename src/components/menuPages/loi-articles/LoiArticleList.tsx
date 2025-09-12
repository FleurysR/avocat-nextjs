// src/components/menuPages/loi-articles/LoiArticleList.tsx

"use client";

import { useState } from "react";
import { LoiArticle } from "@/types";
// Supprimez l'importation de LoiArticleCard car il n'est plus utilisé
import { highlightText } from "@/components/utils/highlightText";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoiArticleListProps {
  articles: LoiArticle[];
  // viewMode n'est plus nécessaire ici
  searchTerm: string;
}

export function LoiArticleList({ articles, searchTerm }: LoiArticleListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const previewLength = 200;

  const toggleExpand = (code: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(code) ? newSet.delete(code) : newSet.add(code);
      return newSet;
    });
  };

  return (
    <ul className="space-y-4">
      {articles.map((article) => {
        const content = article.content || "";
        const isLong = content.length > previewLength;
        const isExpanded = expandedItems.has(article.code);
        const displayText =
          isExpanded ? content : content.slice(0, previewLength) + (isLong ? "..." : "");

        return (
          <li
            key={article.code}
            className="relative p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700
                       shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Titre + numéro */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                    {article.loi}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                    Article n° {article.numero}
                  </span>
                </div>
                {/* Contenu */}
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {highlightText(displayText, searchTerm)}
                </div>
                {/* Bouton Voir plus / moins */}
                {isLong && (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline px-0"
                      onClick={() => toggleExpand(article.code)}
                    >
                      {isExpanded ? "Voir moins" : "Voir plus"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* Effet focus au hover */}
            <span className="absolute inset-0 rounded-xl ring-2 ring-indigo-500 dark:ring-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></span>
          </li>
        );
      })}
    </ul>
  );
}