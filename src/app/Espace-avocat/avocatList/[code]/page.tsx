// src/app/Espace-avocat/avocatList/[code]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Mail, Phone, Clock, BarChart3, TrendingUp, Scale, Calendar, Layers, Target, FileText, User, Globe, MapPin
} from "lucide-react";

// 🚀 IMPORTS API ET TYPES RÉELS
import { fetchAvocatDetails } from "@/services/client-api"; 
import type { 
    AvocatDetails, 
    Choice, 
    StatMatiere 
} from "@/types/index"; 


// --- Composant Spinner local (Garde TEAL, couleur principale de l'app) ---
interface SpinnerProps {
    className?: string;
    size?: number;
    variant: 'ring';
}

const Spinner: React.FC<SpinnerProps> = ({ className = 'text-teal-600 dark:text-teal-400', size = 48 }) => (
    <div 
        className={`inline-block ${className}`}
        style={{ width: size, height: size }}
    >
        <div className="animate-spin rounded-full border-4 border-t-4 border-t-transparent border-teal-500 w-full h-full"></div> 
    </div>
);


// --- COMPOSANTS PRINCIPAUX DE LA PAGE ---

export default function AvocatDetailsPage() {
    const params = useParams();
    const code = params?.code ? params.code as string : ""; 
    const [detailedAvocat, setDetailedAvocat] = useState<AvocatDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      // ... (Logique de chargement) ...
      if (!code) {
        setError("Le code de l'avocat est manquant.");
        setLoading(false);
        return;
      }
  
      const loadAvocat = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchAvocatDetails(code) as AvocatDetails; 
          setDetailedAvocat(data); 
          if (!data) {
            setError("Aucun avocat trouvé pour ce code.");
          }
        } catch (err) {
          setError(`Échec du chargement. Message: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          setLoading(false);
        }
      };
  
      loadAvocat();
    }, [code]);
  
    const getDesignation = (item: Pick<Choice, 'designation'> | string | null | undefined) => {
      if (!item) return "N/A";
      if (typeof item === "string") return item; 
      return item.designation || "N/A";
    };
  
    const getExperienceValue = (years: number | null | undefined): string => {
      if (years === null || years === undefined || years <= 0) return "Moins d'un an";
      return `${years} ans`;
    };
  
    const getSpecialisationsText = (specialites: Choice[] | undefined): string => {
      if (!specialites || specialites.length === 0) return "Non spécifié";
      return specialites.map(s => s.designation).join(', ');
    };

    // LOGIQUE MILIESTONE : Vérifie si le nombre de cas plaidés atteint un palier de 25, 50, 75 ou 100
    const isMilestone = (count: number | null | undefined): boolean => {
        if (count === null || count === undefined) return false;
        return count === 25 || count === 50 || count === 75 || count === 100;
    };
  
    if (loading) {
      return (
          <div className="min-h-screen p-6 flex justify-center items-center bg-gray-50 dark:bg-slate-900">
              <Spinner variant="ring" size={48} className="text-teal-600 dark:text-teal-400" />
          </div>
      );
    }
  
    if (error) {
      return (
          <div className="min-h-screen p-6 flex justify-center items-start pt-20 bg-gray-50 dark:bg-slate-900">
            <div className="p-12 text-center text-red-500 bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-xl">
              <p className="font-medium text-lg">{error}</p>
            </div>
          </div>
      );
    }
  
    if (!detailedAvocat) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>Aucune donnée disponible pour cet avocat.</p>
            </div>
        );
    }
  
    const {
        nom, prenoms, matricule, code: avocatCode, ville, region, email, phonePrincipal,
        yearExercice, ancienneteEnAnnees, inscriptionAt, specialites, nombreDecisionsPlaidees,
        tauxSuccesGlobalPourcentage, tauxSuccesParMatiere, biographie
    } = detailedAvocat;
  
    const experienceSource = ancienneteEnAnnees ?? yearExercice;

  return (
    <div className="min-h-screen p-6 sm:p-10 flex justify-center bg-gray-50 dark:bg-slate-900">
      <div className="w-full max-w-6xl space-y-6">

        {/* 🚀 1. EN-TÊTE / PROFIL MINIMALISTE (Bloc Principal) */}
        <header className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-4">
            
            {/* AVATAR : Couleur harmonisée avec la sidebar */}
            <div className="h-14 w-14 bg-indigo-100 dark:bg-sidebar-primary rounded-full flex items-center justify-center text-xl font-bold text-sidebar-primary dark:text-gray-100 flex-shrink-0">
                {prenoms.charAt(0)}{nom.charAt(0)}
            </div>

            {/* Nom, Matricule, Code, Ville/Région */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {prenoms} <span className="font-extrabold text-sidebar-primary dark:text-indigo-400">{nom}</span>
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Matricule:            **{matricule}** 
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {getDesignation(ville)} | Région {getDesignation(region)}
                </p>
            </div>
          </div>
            
          {/* Ligne de Contact et Expérience */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
              <ContactInfo icon={Mail} value={email || "N/A"} />
              <ContactInfo icon={Phone} value={phonePrincipal || "N/A"} />
              <ContactInfo icon={Clock} value={`${getExperienceValue(experienceSource)} d'ancienneté`} />
          </div>
        </header>

        {/* 🚀 2. SECTION STATISTIQUES CLÉS (Cards) */}
        <StatsSummary 
            globalSuccessRate={tauxSuccesGlobalPourcentage}
            totalCases={nombreDecisionsPlaidees}
            experienceYears={experienceSource} 
            isCasesMilestone={isMilestone(nombreDecisionsPlaidees)}
        />
        
        {/* 🚀 3. LAYOUT BICONNE (Informations vs. Détail du Taux) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne 1/3 (Informations Professionnelles) */}
            <div className="lg:col-span-1">
                <ProfessionalInfo 
                    type="Avocat"
                    inscriptionDate={inscriptionAt}
                    region={getDesignation(region)}
                    ville={getDesignation(ville)}
                    specialisations={getSpecialisationsText(specialites)}
                    
                />
            </div>
            
            {/* Colonne 2/3 (Statistiques Détaillées par Matière) */}
            <div className="lg:col-span-2">
                <SubjectStats stats={tauxSuccesParMatiere} />
            </div>
        </div>
        
        {/* 🚀 4. BIOGRAPHIE (Optionnel) */}
        {biographie && (
            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-sidebar-primary dark:text-indigo-400" /> 
                    <span className="text-sidebar-primary dark:text-indigo-400">Biographie</span> 
                </div>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {biographie}
                </p>
            </section>
        )}

        {/* 🚀 5. DOMAINES D'EXPERTISE (Optionnel) */}
        {specialites && specialites.length > 0 && (
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-slate-700">
              <Layers className="h-6 w-6 text-sidebar-primary dark:text-indigo-400" /> 
              <h2 className="text-2xl font-bold">Domaines d'expertise</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {specialites.map((specialite, index) => (
                <span
                  key={index}
                  className="bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm"
                >
                  {specialite.designation}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


// ----------------------------------------------------------------------------------
// COMPOSANTS RÉUTILISABLES
// ----------------------------------------------------------------------------------

interface ContactInfoProps { icon: React.ElementType; value: string; }
const ContactInfo: React.FC<ContactInfoProps> = ({ icon: Icon, value }) => (
    <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-sidebar-primary dark:text-indigo-400 flex-shrink-0" /> 
        <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {value}
        </span>
    </div>
);

// StatCardProps et StatCard 
interface StatCardProps { 
    icon: React.ElementType; 
    title: string; 
    value: string | number; 
    unit: string; 
    color: string; 
    iconBg: string 
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, unit, color, iconBg }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 transform hover:shadow-xl">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
        <div className="flex justify-between items-end">
            <p className={`text-3xl font-bold ${color}`}>{value}{unit}</p>
            <div className={`w-8 h-8 p-1.5 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
        </div>
    </div>
);

// StatsSummary (Modification pour inclure isCasesMilestone et la nouvelle logique de couleur)
interface StatsSummaryProps { 
    globalSuccessRate: number; 
    totalCases: number; 
    experienceYears: number | null; 
    isCasesMilestone: boolean; 
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ globalSuccessRate, totalCases, experienceYears, isCasesMilestone }) => {
    
    // 💡 LOGIQUE DE COULEUR POUR LE TAUX DE SUCCÈS GLOBAL
    const getGlobalSuccessColor = (percentage: number) => {
        if (percentage >= 75) {
            return { color: 'text-green-700', iconBg: 'bg-green-50 dark:bg-green-900/50' };
        } else if (percentage >= 50) {
            return { color: 'text-amber-600', iconBg: 'bg-amber-50 dark:bg-amber-900/50' };
        } else {
            return { color: 'text-red-600', iconBg: 'bg-red-50 dark:bg-red-900/50' };
        }
    };

    const { color: globalColor, iconBg: globalBg } = getGlobalSuccessColor(globalSuccessRate || 0);

    // Couleurs Spéciales Palier (AMBRE/OR) pour les Décisions Plaidées
    const milestoneColor = "text-amber-600";
    const milestoneIconBg = "bg-amber-50 dark:bg-amber-900/50";
    
    // Couleurs par défaut (BLEU) pour les Décisions Plaidées
    const defaultCaseColor = "text-blue-700";
    const defaultCaseIconBg = "bg-blue-50 dark:bg-blue-900/50";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Taux de Succès Global: COULEUR CONDITIONNELLE APPLIQUÉE */}
            <StatCard 
                icon={TrendingUp} 
                title="Taux de Succès Global" 
                value={(globalSuccessRate || 0).toFixed(2)} 
                unit="%" 
                color={globalColor} // <-- Utilise la couleur conditionnelle
                iconBg={globalBg} // <-- Utilise le fond conditionnel
            />
            
            {/* Décisions Plaidées: COULEUR CONDITIONNELLE (Palier) */}
            <StatCard 
                icon={BarChart3} 
                title="Décisions Plaidées" 
                value={totalCases || 0} 
                unit="" 
                color={isCasesMilestone ? milestoneColor : defaultCaseColor} 
                iconBg={isCasesMilestone ? milestoneIconBg : defaultCaseIconBg} 
            />
            
            {/* Années d'Exercice: Ambre (inchangé) */}
            <StatCard 
                icon={Clock} 
                title="Années d'Exercice" 
                value={experienceYears || 0} 
                unit="" 
                color="text-amber-600" 
                iconBg="bg-amber-50 dark:bg-amber-900/50" 
            />
        </div>
    );
};


// ProfessionalInfo
interface InfoItemProps { icon: React.ElementType; label: string; value: string; isBold?: boolean }
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, isBold = false }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
        <div className="flex items-center gap-3 w-1/3">
            <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</span>
        </div>
        <span className={`text-right text-gray-800 dark:text-gray-200 w-2/3 ${isBold ? 'font-bold' : 'font-normal'} text-sm`}>
            {value}
        </span>
    </div>
);

interface ProfessionalInfoProps { type: string; inscriptionDate: string; region: string; ville: string; specialisations: string; }
const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ type, inscriptionDate, region, ville, specialisations }) => (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 h-full">
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100 mb-6 pb-3 border-b border-gray-100 dark:border-slate-700">
            <Scale className="h-6 w-6 text-sidebar-primary dark:text-indigo-400" /> 
            <h2 className="text-2xl font-bold">Informations Professionnelles</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
            <InfoItem icon={User} label="Type" value={type} />
            <InfoItem icon={Calendar} label="Inscription" value={inscriptionDate ? new Date(inscriptionDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"} />
            <InfoItem icon={Globe} label="Région" value={region} />
            <InfoItem icon={MapPin} label="Ville" value={ville} />
            <InfoItem icon={Layers} label="Spécialités" value={specialisations} isBold={specialisations !== "Non spécifié"} />
        </div>
    </section>
);

// SubjectStats (LOGIQUE DE COULEUR DES PALIERS INTÉGRÉE)
interface SubjectStatsProps { stats: Record<string, StatMatiere> | null; }
const SubjectStats: React.FC<SubjectStatsProps> = ({ stats }) => {
    if (!stats || Object.keys(stats).length === 0) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-3 border-b border-gray-100 dark:border-slate-700 flex items-center">
                <Target className="w-6 h-6 mr-3 text-sidebar-primary dark:text-indigo-400" /> 
                Taux de Succès par Matière
            </h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400 mt-8">
            Aucune donnée de succès disponible par matière pour l'instant.
          </p>
        </div>
      );
    }
    
    // FONCTION DE DÉTERMINATION DE LA COULEUR PAR PALIER (0-25, 25-50, 50-75, 75-100)
    const getSuccessColor = (percentage: number) => {
        if (percentage >= 75) {
            return { bar: 'bg-green-500', text: 'text-green-700 dark:text-green-400' };
        } else if (percentage >= 50) {
            // Bleu pour Bon/Stable
            return { bar: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400' };
        } else if (percentage >= 25) {
            // Ambre/Orange pour Moyen/Faible
            return { bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' };
        } else {
            // Rouge pour Mauvais
            return { bar: 'bg-red-500', text: 'text-red-700 dark:text-red-400' };
        }
    };

    return (
      <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg h-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-3 border-b border-gray-100 dark:border-slate-700 flex items-center">
          <Target className="w-6 h-6 mr-3 text-sidebar-primary dark:text-indigo-400" /> 
          Taux de Succès Détaillé par Matière
        </h2>
        <div className="space-y-6">
            {Object.entries(stats).map(([matiere, s]) => {
              const successPercentage = s.taux_succes_pourcentage || 0;
              const barWidth = `${Math.min(100, successPercentage)}%`;
              
              // OBTENTION DES COULEURS via la nouvelle fonction
              const { bar: barColor, text: textColor } = getSuccessColor(successPercentage);
              
              return (
                <div key={matiere} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">{matiere}</p>
                    <p className={`text-base font-bold ${textColor}`}> {/* Utilisation de textColor */}
                        {successPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all duration-700 ${barColor}`} style={{ width: barWidth }}></div> {/* Utilisation de barColor */}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-right">{s.gagne} victoires sur {s.total} cas</p>
                </div>
              );
            })}
        </div>
      </section>
    );
};