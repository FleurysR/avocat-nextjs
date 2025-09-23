"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { FaEdit } from "react-icons/fa";
import { fetchDossierByCode, exportDossierStrategyPdf } from "@/services/client-api";
import { DossierDetails, DossierDecision, DossierLoiArticle } from "@/types";
import { toast } from "sonner";
import {
  FileText, Briefcase, Gavel, Lightbulb, Scale, PenTool, SearchCheck, Bookmark,
  Handshake, CheckCircle, XCircle, Calendar,
} from "lucide-react";

// Mappage des icônes pour les informations clés
const infoIcons = {
  createdAt: <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
  matiere: <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
  juridiction: <Gavel className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
  chambreJuridique: <Handshake className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
  strategy: <Lightbulb className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
  stylePlaidoirie: <PenTool className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />,
};

// Composant pour une section de rapport
const ReportSection = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string; }) => (
  <section className={`mb-8 ${className}`}>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 flex items-center">
      {title === "Informations Clés" && <Bookmark className="h-6 w-6 text-indigo-500 mr-2" aria-hidden="true" />}
      {title === "Description détaillée" && <FileText className="h-6 w-6 text-gray-500 mr-2" aria-hidden="true" />}
      {title === "Solution Juridique" && <SearchCheck className="h-6 w-6 text-emerald-500 mr-2" aria-hidden="true" />}
      {title === "Points Forts & Faibles" && <Lightbulb className="h-6 w-6 text-amber-500 mr-2" aria-hidden="true" />}
      {title === "Décisions associées" && <Gavel className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />}
      {title === "Articles de loi associés" && <Scale className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />}
      <span>{title}</span>
    </h2>
    <div>{children}</div>
  </section>
);

// Composant pour un bloc d'information stylisé
const InfoBlock = ({ title, value, icon }: { title: string; value: string | undefined | null; icon: React.ReactNode; }) => {
  if (!value) return null;
  return (
    <div className="flex items-center space-x-3 p-2">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

// Composant pour la liste des décisions
const DecisionsList = ({ decisions }: { decisions: DossierDecision[] }) => (
  <ul className="space-y-4">
    {decisions.map((item, index) => (
      <li key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start justify-between">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{item.decision.objet}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span className="font-medium">N° de dossier :</span> {item.decision.numeroDossier || "-"}
          <br />
          <span className="font-medium">Avocat :</span> {item.decision.avocatDemandeur || item.decision.avocatDefendeur || "-"}
          <br />
          <span className="font-medium">Date :</span> {item.decision.decisionAt ? format(new Date(item.decision.decisionAt), "dd MMMM yyyy", { locale: fr }) : "-"}
        </div>
      </li>
    ))}
  </ul>
);

// Composant pour la liste des articles de loi
const LoiArticlesList = ({ articles }: { articles: DossierLoiArticle[] }) => (
  <ul className="space-y-4">
    {articles.map((item, index) => (
      <li key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start justify-between">
          <span className="font-semibold text-gray-900 dark:text-gray-100">Article {item.loiArticle.numero}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
          {item.loiArticle.loi.titre}
        </div>
        {item.formattedContent && (
          <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-md">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Extrait pertinent :</p>
            <div
              className="mt-1 text-sm text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: item.formattedContent }}
            />
          </div>
        )}
      </li>
    ))}
  </ul>
);

export default function DossierDetailsPage() {
  const { code } = useParams<{ code: string }>();
  const [dossier, setDossier] = useState<DossierDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    setError(null);

    fetchDossierByCode(code as string)
      .then((data) => setDossier(data))
      .catch(() => {
        setError("Erreur lors de la récupération des détails du dossier.");
        toast.error("Erreur de chargement des détails.");
      })
      .finally(() => setLoading(false));
  }, [code]);

  const sortedDecisions = useMemo(() => (dossier?.dossierDecisions || []).slice().sort((a, b) => (b.scorePertinence || 0) - (a.scorePertinence || 0)), [dossier]);
  const sortedLoiArticles = useMemo(() => (dossier?.dossierLoiArticles || []).slice().sort((a, b) => (b.scorePertinence || 0) - (a.scorePertinence || 0)), [dossier]);

  // Fonction pour gérer l'exportation du PDF
  const handleExportPdf = async () => {
    if (!dossier?.code) return;
    const toastId = toast.loading("Génération du PDF...", { id: "export-pdf-toast" });
    try {
      const pdfBlob = await exportDossierStrategyPdf(dossier.code);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `strategie-dossier-${dossier.code}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF généré avec succès!", { id: toastId });
    } catch (error) {
      toast.error("Erreur lors de la génération du PDF.", { id: toastId });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-50 p-8">
      <div className="container mx-auto max-w-screen-lg space-y-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Spinner variant="ring" size={60} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-medium my-12 p-6 bg-red-100 dark:bg-red-900 rounded-lg shadow-inner">
            {error}
          </div>
        )}

        {!loading && !error && dossier && (
          <>
            {/* EN-TÊTE PRINCIPAL */}
            <header className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">{dossier.objet}</h1>
              <div className="flex justify-center items-center mt-4 space-x-4">
                <Link href={`/Espace-avocat/Dossier/${dossier.code}/modifier`}>
                  <Button variant="ghost" className="h-10 w-10 p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800" title="Modifier le dossier">
                    <FaEdit className="h-5 w-5" />
                  </Button>
                </Link>
                {/* Bouton pour télécharger le PDF */}
                <Button 
                  variant="ghost" 
                  className="h-10 w-10 p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800" 
                  title="Exporter la stratégie en PDF"
                  onClick={handleExportPdf}
                >
                  <FileText className="h-5 w-5" />
                </Button>
              </div>
            </header>

            {/* INFORMATIONS CLÉS - Design plus moderne et visuel */}
            <ReportSection title="Informations Clés">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                <InfoBlock title="Créé le" value={dossier.createdAt ? format(new Date(dossier.createdAt), "dd MMMM yyyy", { locale: fr }) : "-"} icon={infoIcons.createdAt} />
                <InfoBlock title="Matière" value={dossier.matiere} icon={infoIcons.matiere} />
                <InfoBlock title="Juridiction" value={dossier.juridiction?.designation} icon={infoIcons.juridiction} />
                <InfoBlock title="Chambre" value={dossier.chambreJuridique?.designation} icon={infoIcons.chambreJuridique} />
                <InfoBlock title="Stratégie" value={dossier.strategy?.designation} icon={infoIcons.strategy} />
                <InfoBlock title="Style de plaidoirie" value={dossier.stylePlaidoirie?.designation} icon={infoIcons.stylePlaidoirie} />
              </div>
              {(dossier.keywords?.length > 0 || dossier.contextualTerms?.length > 0) && (
                <div className="mt-6">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Concepts Clés</span>
                  <div className="flex flex-wrap gap-2">
                    {dossier.keywords?.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{keyword}</Badge>
                    ))}
                    {dossier.contextualTerms?.map((term, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{term}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </ReportSection>

            {/* NOUVELLE SECTION - Description détaillée */}
            {dossier.description && (
              <ReportSection title="Description détaillée">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.description}</p>
              </ReportSection>
            )}

            {/* SECTIONS DE CONTENU PRINCIPAL */}
            {dossier.solutionJuridique?.designation && (
              <ReportSection title="Solution Juridique">
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 leading-relaxed bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg border-l-4 border-emerald-500 dark:border-emerald-400">
                  {dossier.solutionJuridique.designation}
                </p>
              </ReportSection>
            )}

            <ReportSection title="Faits">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.faits}</p>
            </ReportSection>

            <ReportSection title="Résumé">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.resume}</p>
            </ReportSection>

            <ReportSection title="Objectif">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.objectif}</p>
            </ReportSection>

            <ReportSection title="Preuves">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.preuves}</p>
            </ReportSection>

            <ReportSection title="Points Forts & Faibles">
              {dossier.pointFort && (
                <div className="mb-6 p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <h3 className="flex items-center text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Point Fort
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.pointFort}</p>
                </div>
              )}
              {dossier.pointFaible && (
                <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950">
                  <h3 className="flex items-center text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide mb-2">
                    <XCircle className="h-5 w-5 mr-2" />
                    Point Faible
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{dossier.pointFaible}</p>
                </div>
              )}
            </ReportSection>

            {/* LISTES LIÉES */}
            {sortedDecisions.length > 0 && (
              <ReportSection title="Décisions associées">
                <DecisionsList decisions={sortedDecisions} />
              </ReportSection>
            )}

            {sortedLoiArticles.length > 0 && (
              <ReportSection title="Articles de loi associés">
                <LoiArticlesList articles={sortedLoiArticles} />
              </ReportSection>
            )}
          </>
        )}
      </div>
    </div>
  );
}