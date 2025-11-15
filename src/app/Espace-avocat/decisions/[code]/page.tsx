// CHEMIN : /app/Espace-avocat/decisions/[code]/page.tsx

"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

// --- Services & Types ---
// IMPORTANT : Assurez-vous que cette fonction existe et est correctement implémentée
import { fetchDecisionByCode } from "@/services/client-api"; 
// IMPORTANT : Assurez-vous que votre fichier de types exporte bien cette interface
import { DetailedDecision } from "@/types"; 

// --- Composants UI ---
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Assurez-vous d'avoir un composant Spinner, ou remplacez-le par un simple texte "Chargement..."
import { Spinner } from "@/components/ui/shadcn-io/spinner"; 

// --- Icônes ---
import {
  ArrowLeft, FileText, Gavel, Scale, Copy, ChevronDown, Download,
  Briefcase, Calendar, Users, Building, CheckCircle, Tag
} from "lucide-react";


// =======================================================
// SOUS-COMPOSANTS LOCAUX POUR UNE MEILLEURE STRUCTURE
// =======================================================

// Composant pour une section sémantique de la page (repliable)
const ReportSection = ({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }) => (
  <section className="bg-white dark:bg-slate-950/50 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
    <details open={defaultOpen} className="group">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <h2 className="flex items-center text-xl font-bold text-gray-800 dark:text-gray-200">
          {icon}
          <span className="ml-3">{title}</span>
        </h2>
        <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </details>
  </section>
);

// Composant pour afficher une information clé avec une icône
const InfoBlock = ({ label, value, icon }: { label: string; value: string | undefined | null; icon: React.ReactNode; }) => {
  if (!value || value === "-") return null;
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
};


// =======================================================
// COMPOSANT PRINCIPAL DE LA PAGE
// =======================================================

export default function DecisionDetailsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [decision, setDecision] = useState<DetailedDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIQUE DE RÉCUPÉRATION DES DONNÉES ---
  useEffect(() => {
    if (!code) {
      setError("Aucun code de décision fourni.");
      setLoading(false);
      return;
    }

    const loadDecision = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDecisionByCode(code); // Appel à votre API
        setDecision(data);
      } catch (err) {
        setError("Erreur lors du chargement de la décision. Veuillez réessayer.");
        toast.error("Impossible de charger les détails de la décision.");
      } finally {
        setLoading(false);
      }
    };

    loadDecision();
  }, [code]);

  // --- FONCTIONS UTILITAIRES ---
  const copyToClipboard = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers !");
  };

  const handleDownloadPdf = async () => {
    if (!decision?.code) return;
    const toastId = toast.loading("Génération du PDF...");
    try {
      // Mettez ici votre logique de fetch vers /api/pdf-decision
      // ...
      toast.success("Téléchargement lancé !", { id: toastId });
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Échec du téléchargement du PDF.", { id: toastId });
    }
  };

  const formattedDate = decision?.decisionAt
    ? new Date(decision.decisionAt).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })
    : "-";

  // --- GESTION DES ÉTATS DE CHARGEMENT ET D'ERREUR ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner variant="ring" size={60} className="text-indigo-500" />
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8 text-center">
        <p className="text-lg font-semibold text-red-500">{error || "Aucune décision correspondante n'a été trouvée."}</p>
        <Button onClick={() => router.back()} className="mt-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la page précédente
        </Button>
      </div>
    );
  }

  // --- AFFICHAGE PRINCIPAL (QUAND LES DONNÉES SONT PRÊTES) ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg shadow-sm py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center text-gray-600 dark:text-gray-300">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
          <div className="flex items-center space-x-2">
            <Button onClick={handleDownloadPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu de la Page */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{decision.objet || "Détails de la Décision"}</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Décision n° {decision.numero || "-"} | Dossier n° {decision.numeroDossier || "-"}
          </p>
        </div>

        <ReportSection title="Généralités" icon={<Gavel className="h-6 w-6 text-indigo-500" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoBlock label="Date de la décision" value={formattedDate} icon={<Calendar className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Juridiction" value={decision.juridiction?.designation} icon={<Building className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Matière" value={decision.matiere} icon={<Briefcase className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Chambre" value={decision.chambre?.designation} icon={<Building className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Formation Judiciaire" value={decision.formationJudiciaire?.designation} icon={<Users className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Président de Chambre" value={decision.presidentChambre} icon={<Gavel className="h-4 w-4 text-gray-500" />} />
          </div>
        </ReportSection>

        <ReportSection title="Parties & Solution" icon={<Users className="h-6 w-6 text-indigo-500" />} defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoBlock label="Demandeur" value={decision.nomDemandeur} icon={<Users className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Avocat Demandeur" value={decision.avocatDemandeur} icon={<Briefcase className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Défendeur" value={decision.nomDefendeur} icon={<Users className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Avocat Défendeur" value={decision.avocatDefendeur} icon={<Briefcase className="h-4 w-4 text-gray-500" />} />
            <InfoBlock label="Solution" value={decision.solution?.designation} icon={<CheckCircle className="h-4 w-4 text-gray-500" />} />
          </div>
        </ReportSection>

        {decision.principeJuridique && (
          <ReportSection title="Principe Juridique" icon={<Scale className="h-6 w-6 text-indigo-500" />}>
            <div className="relative p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{decision.principeJuridique}</p>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(decision.principeJuridique)} className="absolute top-2 right-2 h-8 w-8">
                <Copy className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </ReportSection>
        )}

        {decision.realContent && (
          <ReportSection title="Contenu Complet" icon={<FileText className="h-6 w-6 text-indigo-500" />} defaultOpen={false}>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed p-2">
              {decision.realContent}
            </div>
          </ReportSection>
        )}

        {((decision.keywords?.length || 0) > 0 || (decision.contextualTerms?.length || 0) > 0) && (
          <ReportSection title="Indexation" icon={<Tag className="h-6 w-6 text-indigo-500" />}>
            {decision.keywords && decision.keywords.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Mots-clés :</h3>
                <div className="flex flex-wrap gap-2">
                  {decision.keywords.map((k, i) => <Badge key={`k-${i}`} variant="secondary">{k}</Badge>)}
                </div>
              </div>
            )}
            {decision.contextualTerms && decision.contextualTerms.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Termes Contextuels :</h3>
                <div className="flex flex-wrap gap-2">
                  {decision.contextualTerms.map((t, i) => <Badge key={`t-${i}`} variant="outline">{t}</Badge>)}
                </div>
              </div>
            )}
          </ReportSection>
        )}
      </main>
    </div>
  );
}

