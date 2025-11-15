'use client';

/**
 * =====================================================
 * PAGE PRINCIPALE - CRÉATION DE DOSSIER COMPLET
 * AVEC EXPORT PDF INTÉGRÉ ✅
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/page.tsx
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCompleteDossier, downloadDossierStrategyPdf } from '@/services/client-api';
import { DossierDetails, NewDossierData } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Download, ChevronRight, Loader2 } from 'lucide-react';

// Import des composants
import InitialForm from './Components/InitialForm';
import StepIndicator from './Components/StepIndicator';
import StepDetails from './Components/steps/StepDetails';
import StepJurisprudence from './Components/steps/StepJurisprudence';
import StepLois from './Components/steps/StepLois';
import StepStrategie from './Components/steps/StepStrategie';

export default function CreationDossierIA() {
  const router = useRouter();
  const [completedDossier, setCompletedDossier] = useState<DossierDetails | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // ✅ Création du dossier
  async function handleAnalyse(description: string) {
    setLoading(true);
    setError(null);
    setCompletedDossier(null);
    
    const dossierData: NewDossierData = {
      description: description,
    };

    try {
      console.log('🚀 Appel API : POST /api/dossiers/create-complet');
      const result = await createCompleteDossier(dossierData);
      console.log('✅ Dossier créé complètement:', result.dossier);
      
      setCompletedDossier(result.dossier);
      setCurrentStep(1);
    } catch (err: any) {
      console.error('❌ Erreur création:', err);
      setError(err?.response?.data?.error || 'Une erreur est survenue lors de la création du dossier.');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Télécharger le PDF
  const handleDownloadPdf = async () => {
    if (!completedDossier) return;

    try {
      setDownloadingPdf(true);
      setPdfError(null);
      
      const dossierCode = (completedDossier as any).code;
      console.log('📥 Téléchargement PDF du dossier:', dossierCode);
      
      await downloadDossierStrategyPdf(dossierCode);
      console.log('✅ PDF téléchargé avec succès');
      
    } catch (err: any) {
      console.error('❌ Erreur téléchargement PDF:', err);
      setPdfError(err.message || 'Erreur lors du téléchargement du PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDone = () => {
    if (completedDossier) {
      router.push(`/Espace-avocat/Dossier/${(completedDossier as any).code}`);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Affichage formulaire initial
  if (!completedDossier) {
    return (
      <div className="min-h-screen w-full bg-gray-100 py-12 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <InitialForm 
            onAnalyse={handleAnalyse} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    );
  }

  // Affichage des étapes
  return (
    <div className="min-h-screen w-full bg-gray-100 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-lg border-gray-300 bg-white rounded-2xl">
          {/* HEADER AVEC BOUTON PDF */}
          <CardHeader className="p-6 md:p-8 border-b border-gray-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <Badge className="mb-3 bg-green-100 text-green-800">
                  {/* Code Dossier: {(completedDossier as any).code} */}
                </Badge>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  ✅ Dossier Créé avec Succès !
                </CardTitle>
              </div>
              
              {/* ✅ BOUTON TÉLÉCHARGER PDF */}
              <Button 
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold whitespace-nowrap"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Télécharger PDF
                  </>
                )}
              </Button>
            </div>

            {/* Erreur PDF */}
            {pdfError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">❌ {pdfError}</p>
              </div>
            )}

            <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
          </CardHeader>

          {/* CONTENU DES ÉTAPES */}
          <CardContent className="p-6 md:p-8 min-h-96">
            {currentStep === 1 && <StepDetails dossier={completedDossier} />}
            {currentStep === 2 && <StepJurisprudence dossier={completedDossier} />}
            {currentStep === 3 && <StepLois dossier={completedDossier} />}
            {currentStep === 4 && <StepStrategie dossier={completedDossier} />}
          </CardContent>

          {/* FOOTER AVEC BOUTONS */}
          <CardFooter className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 rounded-b-2xl border-t border-gray-300">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                size="sm"
              >
                ← Précédent
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNextStep}
                disabled={currentStep === 4}
                size="sm"
                className="gap-2"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCompletedDossier(null);
                  setCurrentStep(1);
                  setPdfError(null);
                }}
                size="sm"
              >
                Nouveau Dossier
              </Button>
              <Button 
                onClick={handleDone}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
              >
                <Download className="w-4 h-4" />
                Consulter le Dossier
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
