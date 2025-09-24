// src/components/menuPages/lois/LoiCard.tsx

"use client";

import React from 'react';
import Link from 'next/link';
// Importez la nouvelle interface LoiCategory
import { LoiCategory } from "@/types"; 

// Définissez les props pour que 'loi' soit de type LoiCategory
interface LoiCardProps {
  loi: LoiCategory;
}

export function LoiCard({ loi }: LoiCardProps) {
  const linkHref = `/Espace-avocat/lois/categories/${loi.code}`; 

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <Link href={linkHref}>
        <h3 className="text-lg font-semibold text-blue-600 hover:underline">{loi.designation}</h3>
      </Link>
      <p className="text-sm text-gray-600 mt-2">{loi.description}</p>
    </div>
  );
}