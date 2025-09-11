"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DossierDetails, DossierDecision, DossierLoiArticle } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailedDossier: DossierDetails | null;
  loading: boolean;
  error: string | null;
}

const renderListItem = (label: string, value: string | undefined | null) => {
    if (!value) return null;
    return (
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{label}:</span>
            <span>{value}</span>
        </div>
    );
};

const renderSection = (title: string, content: string | undefined | null) => {
    if (!content) return null;
    return (
        <div className="bg-gray-100 dark:bg-slate-950 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
        </div>
    );
};

const renderNestedList = (title: string, items: { designation: string }[] | undefined) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="bg-gray-100 dark:bg-slate-950 p-4 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <Badge key={index} variant="secondary">{item.designation}</Badge>
                ))}
            </div>
        </div>
    );
};

export default function DossierModal({
  isOpen,
  onClose,
  detailedDossier,
  loading,
  error,
}: DossierModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-100 dark:bg-slate-900">
        {/*
          Le DialogHeader et le DialogTitle sont maintenant toujours rendus pour l'accessibilité.
          Le contenu du titre et de la description est mis à jour dynamiquement.
        */}
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {loading && "Chargement du dossier..."}
            {error && "Erreur de chargement"}
            {!loading && !error && detailedDossier && `Dossier: ${detailedDossier.objet}`}
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-500 dark:text-gray-400">
            {loading && "Veuillez patienter pendant le chargement des informations."}
            {error && "Une erreur est survenue lors de la récupération des détails."}
            {!loading && !error && detailedDossier && `Informations détaillées sur le dossier ${detailedDossier.code}`}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center p-16">
            <Spinner variant="ring" size={48} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 p-6">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && detailedDossier && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderListItem("Code", detailedDossier.code)}
              {renderListItem("Matière", detailedDossier.matiere)}
              {renderListItem("Créé le", format(new Date(detailedDossier.createdAt), "dd MMMM yyyy", { locale: fr }))}
              {renderListItem("Juridiction", detailedDossier.juridiction?.designation)}
              {renderListItem("Stratégie", detailedDossier.strategy?.designation)}
              {renderListItem("Style de plaidoirie", detailedDossier.stylePlaidoirie?.designation)}
            </div>

            {detailedDossier.solutionJuridique?.designation && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Solution</h3>
                <Badge 
                  className="px-4 py-2 text-base font-semibold bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-400 dark:hover:bg-indigo-500 rounded-xl"
                >
                  {detailedDossier.solutionJuridique.designation}
                </Badge>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-6">
              {renderSection("Faits", detailedDossier.faits)}
              {renderSection("Résumé", detailedDossier.resume)}
              {renderSection("Objectif", detailedDossier.objectif)}
              {renderSection("Preuves", detailedDossier.preuves)}
              {renderSection("Point Fort", detailedDossier.pointFort)}
              {renderSection("Point Faible", detailedDossier.pointFaible)}

              {detailedDossier.dossierDecisions && detailedDossier.dossierDecisions.length > 0 && (
                <div className="bg-gray-100 dark:bg-slate-950 p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Décisions associées</h3>
                  <ul className="space-y-2">
                    {detailedDossier.dossierDecisions.map((item: DossierDecision, index: number) => (
                      <li key={index} className="text-sm">
                        <Badge variant="outline" className="mr-2">
                          Score: {item.scorePertinence}
                        </Badge>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.decision.objet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detailedDossier.dossierLoiArticles && detailedDossier.dossierLoiArticles.length > 0 && (
                <div className="bg-gray-100 dark:bg-slate-950 p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Articles de loi associés</h3>
                  <ul className="space-y-2">
                    {detailedDossier.dossierLoiArticles.map((item: DossierLoiArticle, index: number) => (
                      <li key={index} className="text-sm">
                        <Badge variant="outline" className="mr-2">
                          Score: {item.scorePertinence}
                        </Badge>
                        <span className="text-gray-700 dark:text-gray-300">
                          Article {item.loiArticle.numero}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
