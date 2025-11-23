"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchDecisionByCode, exportDecisionPdf } from "@/services/client-api";
import { DetailedDecision } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import { ArrowLeft, Download, AlertCircle, Copy, Check } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// FONCTION DE TRAITEMENT DU TEXTE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nettoie et formate le contenu du jugement
 * - Supprime les sauts de ligne indésirables
 * - Combine les mots coupés
 * - Formate les paragraphes
 */
const cleanDecisionContent = (text: string): string => {
  if (!text) return "";

  // 1. Remplacer les multiples espaces et sauts de ligne par un seul espace
  let cleaned = text.replace(/\s+/g, ' ').trim();

  // 2. Ajouter un retour à la ligne après les points suivis de majuscules (nouvelle phrase)
  cleaned = cleaned.replace(/(\.\s+)(?=[A-Z])/g, '$1\n\n');

  // 3. Ajouter un retour à la ligne après les deux-points (nouvelle section)
  cleaned = cleaned.replace(/(:)(?=\s+[A-Z])/g, '$1\n');

  // 4. Ajouter un retour à la ligne après "Attendu que" (marque des considérants)
  cleaned = cleaned.replace(/(\.\s*Attendu que)/gi, '\n\nATTENDU QUE');
  cleaned = cleaned.replace(/^Attendu que/gmi, 'ATTENDU QUE');

  // 5. Ajouter un retour à la ligne après "PAR CES MOTIFS"
  cleaned = cleaned.replace(/(\.\s*PAR CES MOTIFS)/gi, '\n\nPAR CES MOTIFS');
  cleaned = cleaned.replace(/^PAR CES MOTIFS/gmi, 'PAR CES MOTIFS');

  // 6. Formater les points numerotés (1. 2. 3. etc)
  cleaned = cleaned.replace(/(\n|^)(\d+\.\s+)/gm, '\n\n$2');

  // 7. Nettoyer les références multiples (exemple: "du 10 janvier du 02 mai" => corriger)
  cleaned = cleaned.replace(/du\s+(\d+\s+\w+)\s+du\s+(\d+\s+\w+)/gi, 'du $1 au $2');

  // 8. Ajouter des retours à la ligne avant les noms propres en majuscules (parties)
  cleaned = cleaned.replace(/([A-Z]{2,})\s+(?=[A-Z][a-z]+)/g, '$1\n');

  // 9. Ajouter des espaces après les virgules manquantes
  cleaned = cleaned.replace(/,(?=\S)/g, ', ');

  return cleaned;
};

/**
 * Formate le texte pour l'affichage avec paragraphes
 */
const formatParagraphs = (text: string): React.ReactNode[] => {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  
  return paragraphs.map((para, idx) => {
    const isHeading = /^(ATTENDU QUE|PAR CES MOTIFS|CONSIDÉRANT|STATUANT)/i.test(para.trim());
    
    if (isHeading) {
      return (
        <p key={idx} className="font-bold text-gray-900 dark:text-white mt-6 mb-2 uppercase text-sm tracking-wide">
          {para.trim()}
        </p>
      );
    }
    
    return (
      <p key={idx} className="text-justify text-gray-900 dark:text-gray-100 leading-8 mb-4">
        {para.trim()}
      </p>
    );
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function DecisionDetailsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [decision, setDecision] = useState<DetailedDecision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) {
      setError("Aucun code fourni.");
      setLoading(false);
      return;
    }

    const loadDecision = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchDecisionByCode(code);
        setDecision(data);
      } catch (err: any) {
        setError("Impossible de charger la décision.");
        toast.error("Erreur");
      } finally {
        setLoading(false);
      }
    };

    loadDecision();
  }, [code]);

  const handleDownloadPdf = async () => {
    if (!decision?.code) return;
    
    setDownloading(true);
    const toastId = toast.loading("Génération du PDF...");
    
    try {
      const blob = await exportDecisionPdf(decision.code);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Decision-${decision.numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF téléchargé !", { id: toastId });
    } catch (err) {
      toast.error("Erreur téléchargement.", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const copyContent = () => {
    if (decision?.realContent) {
      const cleanedText = cleanDecisionContent(decision.realContent);
      navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner variant="ring" size={60} className="text-blue-500" />
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-lg text-red-500 mb-6">{error}</p>
        <Button onClick={() => router.back()} className="bg-blue-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  // Nettoyer le contenu
  const cleanedContent = decision.realContent ? cleanDecisionContent(decision.realContent) : "";
  const cleanedPrinciple = decision.principeJuridique ? cleanDecisionContent(decision.principeJuridique) : "";

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md p-4 mb-4 rounded-lg">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-700 dark:text-gray-300">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyContent}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </>
              )}
            </Button>
            
            <Button onClick={handleDownloadPdf} disabled={downloading} className="bg-blue-600">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto">
        
        {/* Carte d'information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">ARRÊT N°</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{decision.numero}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">DATE</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {decision.decisionAt ? new Date(decision.decisionAt).toLocaleDateString("fr-FR") : "-"}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">DEMANDEUR</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
              {decision.nomDemandeur?.split(' ')[0] || "..."}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">DÉFENDEUR</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">
              {decision.nomDefendeur?.split(' ')[0] || "..."}
            </p>
          </div>
        </div>

        {/* Document complet */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
          
          {/* En-tête */}
          <div className="text-center border-b-2 border-gray-300 dark:border-gray-700 pb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">RÉPUBLIQUE DE MADAGASCAR</p>
            <p className="text-sm my-2 text-gray-500 dark:text-gray-400">─────────────────────────────</p>
            <p className="text-base font-bold uppercase text-gray-900 dark:text-white">{decision.juridiction?.designation || "Cour de Cassation"}</p>
            <p className="text-sm font-semibold uppercase text-gray-700 dark:text-gray-300 mt-1">{decision.chambre?.designation || "Chambre Civile"}</p>
          </div>

          {/* Référence et infos */}
          <div className="grid grid-cols-2 gap-6 text-sm border-b border-gray-300 dark:border-gray-700 pb-6">
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">ARRÊT N°</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{decision.numero}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">DOSSIER N°</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{decision.numeroDossier}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">DATE</p>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {decision.decisionAt ? new Date(decision.decisionAt).toLocaleDateString("fr-FR", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                }).replace(/^./, str => str.toUpperCase()) : "-"}
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-700 dark:text-gray-300">MATIÈRE</p>
              <p className="text-sm text-gray-900 dark:text-white mt-1">{decision.matiere}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="space-y-4 text-sm border-b border-gray-300 dark:border-gray-700 pb-6">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">DEMANDEUR :</p>
              <p className="text-gray-700 dark:text-gray-300 ml-4 mt-1">{decision.nomDemandeur}</p>
              {decision.avocatDemandeur && (
                <p className="text-gray-500 dark:text-gray-400 ml-4 text-xs mt-1">Avocat : {decision.avocatDemandeur}</p>
              )}
            </div>

            <div>
              <p className="font-bold text-gray-900 dark:text-white">DÉFENDEUR :</p>
              <p className="text-gray-700 dark:text-gray-300 ml-4 mt-1">{decision.nomDefendeur}</p>
              {decision.avocatDefendeur && (
                <p className="text-gray-500 dark:text-gray-400 ml-4 text-xs mt-1">Avocat : {decision.avocatDefendeur}</p>
              )}
            </div>
          </div>

          {/* Corps du jugement - TEXTE NETTOYÉ */}
          <div className="space-y-6">
            <p className="text-center font-bold text-gray-600 dark:text-gray-400">─────────────</p>

            {cleanedContent && (
              <div className="text-sm leading-8 text-justify text-gray-900 dark:text-gray-100 font-serif space-y-4">
                {formatParagraphs(cleanedContent)}
              </div>
            )}

            {/* Principe juridique - NETTOYÉ */}
            {cleanedPrinciple && (
              <div className="mt-8 pt-8 border-t-2 border-gray-400 dark:border-gray-600">
                <p className="font-bold uppercase text-sm text-gray-900 dark:text-white mb-4">Principe Juridique :</p>
                <div className="italic bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500 text-sm leading-8 text-gray-900 dark:text-gray-100">
                  {formatParagraphs(cleanedPrinciple)}
                </div>
              </div>
            )}
          </div>

          {/* Solution et mots-clés */}
          <div className="border-t-2 border-gray-400 dark:border-gray-600 pt-6 mt-8">
            {decision.solution && (
              <div className="mb-6">
                <p className="font-bold uppercase text-sm text-gray-900 dark:text-white mb-2">SOLUTION</p>
                <p className="text-base font-bold text-blue-700 dark:text-blue-400">{decision.solution.designation}</p>
              </div>
            )}

            {(decision.keywords?.length || 0) > 0 && (
              <div>
                <p className="font-bold uppercase text-sm text-gray-900 dark:text-white mb-3">MOTS-CLÉS</p>
                <div className="flex flex-wrap gap-2">
                  {decision.keywords?.map((k, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pied de page */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
            <p>Fait à {decision.juridiction?.designation || "Madagascar"}</p>
            <p className="mt-2">
              Le {decision.decisionAt ? new Date(decision.decisionAt).toLocaleDateString("fr-FR") : ""}
            </p>
            {decision.presidentChambre && (
              <p className="mt-6 font-semibold">Président : {decision.presidentChambre}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
