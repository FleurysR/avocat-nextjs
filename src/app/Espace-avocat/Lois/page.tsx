"use client";

import React from 'react';
import { useLoiCategories } from '@/hooks/Lois/useLoisCategories';
import { LoiCategoryCard } from '@/components/menuPages/lois/loisCategoriesCard';
import { FileText } from "lucide-react"; // Importez l'icône
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";

export default function LoisCategoriesPage() {
  const { categories, loading, error } = useLoiCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-indigo-500">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-4 sm:mb-0">
          <FileText className="h-8 w-8" />
          🏛️ Catégories de Lois
        </h1>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <LoiCategoryCard key={category.code} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}