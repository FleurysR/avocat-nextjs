// src/app/Espace-avocat/avocatList/[code]/page.tsx (Code principal)

"use client";

import React, { useState, useEffect } from "react";
import { AvocatDetails, Choice } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  User,
  SquareGanttChart,
  Calendar,
  Layers,
  FileText,
  Clock,
  Globe,
  Home,
  GanttChartSquare, // Utilisé pour remplacer SquareGanttChart dans les propriétés
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

  const getExperienceValue = (years: number | null | undefined): string => {
    if (!years || years <= 0) {
      return "Moins d'un an";
    }
    return `${years} an${years > 1 ? 's' : ''}`;
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
            
            {/* 🚀 SECTION PRINCIPALE : En-tête de Profil (INCHANGÉ) */}
            <header className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center md:items-start md:space-x-10 relative overflow-hidden transform-gpu animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 via-transparent to-amber-50 dark:from-slate-700 dark:to-slate-900 opacity-60 rounded-3xl z-0"></div>

              <div className="relative z-10 flex-shrink-0 mb-8 md:mb-0">
                <div className="h-32 w-32 bg-gradient-to-br from-teal-400 to-amber-400 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
                  <User className="h-20 w-20 text-white dark:text-gray-300 opacity-80" />
                </div>
                <Badge className="absolute -bottom-2 -right-4 text-md font-bold bg-teal-700 dark:bg-teal-500 text-white dark:text-slate-900 rounded-full px-4 py-1.5 shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-200 ease-out">
                  Matricule: {detailedAvocat.matricule || "N/A"}
                </Badge>
              </div>

              <div className="relative z-10 flex-grow text-center md:text-left space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                  {detailedAvocat.prenoms} <span className="text-teal-700 dark:text-teal-400">{detailedAvocat.nom}</span>
                </h1>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 italic">
                  Avocat inscrit au barreau de {getDesignation(detailedAvocat.region)}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoBlock label="Email" value={detailedAvocat.email || "Non spécifié"} />
                  <InfoBlock label="Téléphone" value={detailedAvocat.phonePrincipal || "Non spécifié"} />
                  <InfoBlock label="Ville" value={detailedAvocat.ville || "Non spécifié"} />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition-colors duration-200 transform hover:scale-105">
                        Contacter cet Avocat
                    </button>
                    <button className="px-8 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-colors duration-200 transform hover:scale-105">
                        Prendre Rendez-vous
                    </button>
                </div>
              </div>
            </header>

            {/* 🚀 NOUVELLE SECTION : Détails Légaux et Administratifs (Type Fichier) */}
            <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 animate-fade-in delay-200">
                <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-teal-200 dark:border-slate-700">
                    <GanttChartSquare className="h-8 w-8 text-teal-700 dark:text-teal-400" />
                    <h2 className="text-3xl font-bold">Détails Légaux et Administratifs</h2>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    <PropertyListItem
                        icon={Clock}
                        label="Années d'expérience"
                        value={getExperienceValue(detailedAvocat.yearExercice)}
                    />
                    <PropertyListItem
                        icon={Calendar}
                        label="Date d'inscription au Barreau"
                        value={new Date(detailedAvocat.inscriptionAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) || "Non spécifié"}
                    />
                    <PropertyListItem
                        icon={SquareGanttChart}
                        label="Genre"
                        value={getGenre(detailedAvocat.genre)}
                    />
                    <PropertyListItem
                        icon={Home}
                        label="Commune d'Exercice"
                        value={getDesignation(detailedAvocat.commune)}
                    />
                    <PropertyListItem
                        icon={MapPin}
                        label="District"
                        value={getDesignation(detailedAvocat.district)}
                    />
                    <PropertyListItem
                        icon={Globe}
                        label="Région du Barreau"
                        value={getDesignation(detailedAvocat.region)}
                    />
                </div>
            </section>

            {/* 🚀 SECTION : À Propos / Biographie (INCHANGÉ) */}
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

            {/* 🚀 SECTION : Domaines d'Expertise / Spécialités (INCHANGÉ) */}
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


// ----------------------------------------------------------------------------------
// COMPOSANTS RÉUTILISABLES
// ----------------------------------------------------------------------------------

// Composant réutilisable pour les blocs d'information de l'en-tête (cliquable)
interface InfoBlockProps {
  label: string;
  value: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value }) => {
  let Icon: React.ElementType;
  let href: string | undefined = undefined;

  if (label === "Email") {
    Icon = Mail;
    if (value !== "Non spécifié") {
      href = `mailto:${value}`;
    }
  } else if (label === "Téléphone") {
    Icon = Phone;
    if (value !== "Non spécifié") {
      href = `tel:${value.replace(/\s/g, "")}`;
    }
  } else if (label === "Ville") {
    Icon = MapPin;
  } else {
    Icon = Globe;
  }

  const content = (
    <div className={`flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg shadow-sm text-gray-800 dark:text-gray-200 ${href ? 'hover:shadow-md cursor-pointer' : ''} transition-shadow duration-200 ease-out`}>
      <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
};


// NOUVEAU COMPOSANT : Style "Fichier Document" (Remplaçant FactCard)
interface PropertyListItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const PropertyListItem: React.FC<PropertyListItemProps> = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
        <div className="flex items-center gap-4">
            <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {label}
            </span>
        </div>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {value}
        </p>
    </div>
);