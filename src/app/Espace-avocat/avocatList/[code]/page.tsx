// src/app/Espace-avocat/avocatList/[code]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { AvocatDetails, Choice } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  SquareGanttChart,
  Calendar,
  Layers,
  FileText,
  Clock,
  Globe,
} from "lucide-react";
import { useParams } from "next/navigation";

// Votre fonction d'appel API
import { fetchAvocatDetails } from "@/services/client-api";

export default function AvocatDetailsPage() {
  const params = useParams();
  const code = params.code as string;

  const [detailedAvocat, setDetailedAvocat] = useState<AvocatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("Le code de l'avocat est manquant.");
      setLoading(false);
      return;
    }

    const loadAvocat = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAvocatDetails(code);
        setDetailedAvocat(data);
        if (!data) {
          setError("Aucun avocat trouvé pour ce code.");
        }
      } catch (err) {
        setError("Échec du chargement des détails de l'avocat. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    loadAvocat();
  }, [code]);

  const getDesignation = (item: { designation?: string } | string | null | undefined) => {
    if (!item) return "Non spécifié";
    if (typeof item === "string") return "Non spécifié";
    return item.designation || "Non spécifié";
  };

  const getGenre = (genre: Choice | Choice[] | null | undefined) => {
    if (!genre) return "Non spécifié";
    if (Array.isArray(genre)) {
      return genre.length > 0 ? genre[0].designation : "Non spécifié";
    }
    return genre?.designation || "Non spécifié";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 dark:from-slate-900 to-amber-50 dark:to-slate-900 p-6 sm:p-10 flex justify-center">
      <div className="w-full max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner variant="ring" size={48} className="text-teal-600 dark:text-teal-400" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <p className="font-medium text-lg">{error}</p>
          </div>
        ) : detailedAvocat ? (
          <div className="space-y-12">
            {/* 🚀 SECTION PRINCIPALE : En-tête de Profil */}
            <header className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center md:items-start md:space-x-10 relative overflow-hidden transform-gpu animate-fade-in-up">
              {/* Effet de fond subtil avec des couleurs plus chaudes */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 via-transparent to-amber-50 dark:from-slate-700 dark:to-slate-900 opacity-60 rounded-3xl z-0"></div>

              <div className="relative z-10 flex-shrink-0 mb-8 md:mb-0">
                {/* Icône user avec un dégradé plus coloré */}
                <div className="h-32 w-32 bg-gradient-to-br from-teal-400 to-amber-400 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
                  <User className="h-20 w-20 text-white dark:text-gray-300 opacity-80" />
                </div>
                <Badge className="absolute -bottom-2 -right-4 text-md font-bold bg-teal-700 dark:bg-teal-500 text-white dark:text-slate-900 rounded-full px-4 py-1.5 shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-200 ease-out">
                  Matricule: {detailedAvocat.matricule || "N/A"}
                </Badge>
              </div>

              <div className="relative z-10 flex-grow text-center md:text-left space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight tracking-tighter">
                  {detailedAvocat.prenoms} <span className="text-teal-700 dark:text-teal-400">{detailedAvocat.nom}</span>
                </h1>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 italic">
                  Avocat inscrit au barreau de {getDesignation(detailedAvocat.region)}
                </p>

                {/* Blocs d'informations de contact plus compacts */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoBlock icon={Mail} label="Email" value={detailedAvocat.email || "Non spécifié"} />
                  <InfoBlock icon={Phone} label="Téléphone" value={detailedAvocat.phonePrincipal || "Non spécifié"} />
                  <InfoBlock icon={MapPin} label="Ville" value={detailedAvocat.ville || "Non spécifié"} />
                </div>
              </div>
            </header>

            {/* 🚀 SECTION : Détails Professionnels (Fact Cards) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-200">
              <FactCard
                icon={Clock}
                label="Années d'expérience"
                value={`${detailedAvocat.yearExercice || "N/A"} ans`}
              />
              <FactCard
                icon={Calendar}
                label="Date d'inscription"
                value={new Date(detailedAvocat.inscriptionAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) || "Non spécifié"}
              />
              <FactCard
                icon={SquareGanttChart}
                label="Genre"
                value={getGenre(detailedAvocat.genre)}
              />
              <FactCard
                icon={Globe}
                label="Commune"
                value={getDesignation(detailedAvocat.commune)}
              />
              <FactCard
                icon={Globe}
                label="District"
                value={getDesignation(detailedAvocat.district)}
              />
               <FactCard
                icon={Globe}
                label="Région"
                value={getDesignation(detailedAvocat.region)}
              />
            </section>

            {/* 🚀 SECTION : À Propos / Biographie */}
            {detailedAvocat.biographie && (
              <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 animate-fade-in delay-400">
                <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <FileText className="h-8 w-8 text-teal-700 dark:text-teal-400" />
                  <h2 className="text-3xl font-bold">À propos de {detailedAvocat.prenoms}</h2>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {detailedAvocat.biographie}
                </p>
              </section>
            )}

            {/* 🚀 SECTION : Domaines d'Expertise / Spécialités */}
            {detailedAvocat.specialites && detailedAvocat.specialites.length > 0 && (
              <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 animate-fade-in delay-600">
                <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <Layers className="h-8 w-8 text-teal-700 dark:text-teal-400" />
                  <h2 className="text-3xl font-bold">Domaines d'expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {detailedAvocat.specialites.map((specialite, index) => (
                    <Badge
                      key={index}
                      className="bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200 text-base font-medium px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform duration-200 ease-out"
                    >
                      {specialite.designation}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>Aucune donnée disponible pour cet avocat.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant réutilisable pour les blocs d'information de l'en-tête (plus compact)
interface InfoBlockProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg shadow-sm text-gray-800 dark:text-gray-200 hover:shadow-md transition-shadow duration-200 ease-out">
    <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  </div>
);

// Composant réutilisable pour les "Fact Cards" (plus petits)
interface FactCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const FactCard: React.FC<FactCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] duration-300 ease-in-out border border-gray-100 dark:border-slate-700">
    <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400 mb-3" />
    <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</h3>
    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);