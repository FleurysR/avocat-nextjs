"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Briefcase, BookOpen, Search, Newspaper, FileText } from "lucide-react";

// Importez vos composants Card et Tabs (si vous utilisez shadcn/ui ou équivalent)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatCard } from "./_components/StatCard";
import { RecentDossiers } from "./_components/RecentDossiers";
import { QuickActions } from "./_components/QuickActions";
import { ActivityChart } from "./_components/ActivityChart";

// --- Nouveaux composants à créer (placeholders) ---

// Placeholder pour les recherches récentes
const RecentSearches = () => (
  <Card>
    <CardHeader><CardTitle>Vos Recherches Récentes</CardTitle></CardHeader>
    <CardContent>
      {/* Vous listerez ici les 5 dernières recherches */}
      <p className="text-sm text-gray-500">Bientôt disponible...</p>
    </CardContent>
  </Card>
);

// Placeholder pour les nouveautés
const NewsAndUpdates = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Newspaper size={20} />
        <span>Nouveautés Juridiques</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <FileText size={18} className="mt-1 text-blue-500" />
        <div>
          <p className="font-semibold text-sm">Nouvelle loi sur la cybercriminalité</p>
          <p className="text-xs text-gray-500">Ajoutée le 08/11/2025</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <FileText size={18} className="mt-1 text-blue-500" />
        <div>
          <p className="font-semibold text-sm">Mise à jour du Code du Travail</p>
          <p className="text-xs text-gray-500">Mise à jour le 05/11/2025</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- Page principale ---

interface UserStats {
  activeDossiers: number;
  searchesThisMonth: number;
  generatedDocs: number;
}

export default function AccueilPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats({
      activeDossiers: 12,
      searchesThisMonth: 84,
      generatedDocs: 23,
    });
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Voici un aperçu de votre activité et des outils à votre disposition.
          </p>
        </header>

        {/* Grille principale en deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* COLONNE PRINCIPALE (GAUCHE) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* 1. Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard label="Dossiers en cours" value={String(stats?.activeDossiers ?? "...")} icon={Briefcase} color="text-blue-500" />
              <StatCard label="Recherches (mois)" value={String(stats?.searchesThisMonth ?? "...")} icon={Search} color="text-green-500" />
              <StatCard label="Documents générés" value={String(stats?.generatedDocs ?? "...")} icon={BookOpen} color="text-purple-500" />
            </div>
            {/* 2. Graphique d'activité */}
            <Card>
              <CardHeader><CardTitle>Votre Activité Récente</CardTitle></CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>
            {/* 3. Onglets pour les listes dynamiques */}
            <Tabs defaultValue="dossiers">
              <TabsList>
                <TabsTrigger value="dossiers">Dossiers Récents</TabsTrigger>
                <TabsTrigger value="recherches">Recherches Récentes</TabsTrigger>
              </TabsList>
              <TabsContent value="dossiers" className="mt-4">
                <RecentDossiers />
              </TabsContent>
              <TabsContent value="recherches" className="mt-4">
                <RecentSearches />
              </TabsContent>
            </Tabs>

          </div>

          {/* COLONNE LATÉRALE (DROITE) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* 1. Actions rapides */}
            <QuickActions />

            {/* 2. Nouveautés et mises à jour */}
            <NewsAndUpdates />
            
            {/* Le composant RecetteDossiers peut aller ici aussi, si c'est un résumé */}
            {/* <RecetteDossiers /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
