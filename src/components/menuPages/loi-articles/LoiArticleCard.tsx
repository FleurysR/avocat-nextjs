
"use client";

import { useState } from "react";
import { highlightText } from "@/components/utils/highlightText";
import { LoiArticle } from "@/types";
import { Button } from "@/components/ui/button";

interface LoiArticleCardProps {
  article: LoiArticle;
  search: string;
}

export function LoiArticleCard({ article, search }: LoiArticleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 200;
  const content = article.content || "";
  const isLong = content.length > previewLength;
  const displayText = expanded ? content : content.slice(0, previewLength) + (isLong ? "..." : "");

  return (
    <li className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-lg rounded-3xl border border-slate-200 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-200">
      <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-300 mb-1">{article.loi.titre}</h3>
      <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
        📄 Article n° {article.numero}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
        {highlightText(displayText, search)}
      </p>
      {isLong && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Voir moins" : "Voir plus"}
          </Button>
        </div>
      )}
    </li>
  );
}