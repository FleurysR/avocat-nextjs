// src/components/menuPages/lois/LoiCategoryCard.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, LayoutGrid } from "lucide-react";
import Link from 'next/link';

interface LoiCategoryCardProps {
  category: {
    code: string;
    designation: string;
    description: string;
  };
}

export function LoiCategoryCard({ category }: LoiCategoryCardProps) {
  return (
    <Link href={`/Espace-avocat/lois/categories/${category.code}`}>
      <Card className="w-full h-full shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500 dark:bg-indigo-400 p-2 rounded-full">
              <FileText className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {category.designation}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}