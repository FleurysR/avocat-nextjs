// src/components/menuPages/loi-articles/LoiArticleList.tsx

"use client";

import { useState } from "react";
import { LoiArticle } from "@/types";
import { LoiArticleCard } from "@/components/menuPages/loi-articles/LoiArticleCard";
import { highlightText } from "@/components/utils/highlightText";
import { List, LayoutGrid, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LoiArticleListProps {
  articles: LoiArticle[];
  viewMode: "card" | "list";
  searchTerm: string;
}

export function LoiArticleList({ articles, viewMode, searchTerm }: LoiArticleListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const previewLength = 200;

  const toggleExpand = (code: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  if (viewMode === "list") {
    return (
      <ul className="space-y-4">
        {articles.map((article) => {
          const content = article.content || "";
          const isLong = content.length > previewLength;
          const isExpanded = expandedItems.has(article.code);
          const displayText = isExpanded ? content : content.slice(0, previewLength) + (isLong ? "..." : "");

          return (
            <li
              key={article.code}
              className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700
                         hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                      {article.loi}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                      Article n° {article.numero}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {highlightText(displayText, searchTerm)}
                  </p>
                  {isLong && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={() => toggleExpand(article.code)}>
                        {isExpanded ? "Voir moins" : "Voir plus"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <span className="absolute inset-0 rounded-xl ring-2 ring-indigo-500 dark:ring-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></span>
            </li>
          );
        })}
      </ul>
    );
  }

  // Rendu en mode 'card'
  return (
    <ul className="space-y-8">
      {articles.map((article) => (
        <LoiArticleCard
          key={article.code}
          article={article}
          search={searchTerm}
        />
      ))}
    </ul>
  );
}