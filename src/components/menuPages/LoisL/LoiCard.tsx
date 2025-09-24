// src/components/menuPages/LoisL/LoiCard.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText } from "lucide-react"; // Utilisez une icône appropriée pour une loi
import Link from 'next/link';
import { Loi } from "@/types"; // Importez l'interface Loi depuis votre fichier de types

interface LoiCardProps {
  loi: Loi;
}

export function LoiCard({ loi }: LoiCardProps) {
  return (
    // Le lien mène vers la page de détail de cette loi
    <Link href={`/Espace-avocat/lois/${loi.code}`}>
      <Card className="w-full h-full shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500 dark:bg-indigo-400 p-2 rounded-full">
              <BookText className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {loi.titre}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold">Numéro: {loi.numero}</p>
            <p className="mt-1">Publié en: {loi.publieAt}</p>
          </CardDescription>
        </CardContent>
        {/* Vous pouvez ajouter un CardFooter avec des informations supplémentaires si besoin */}
      </Card>
    </Link>
  );
}