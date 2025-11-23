"use client";

/**
 * =====================================================
 * PAGE PRINCIPALE - CRÉATION DE DOSSIER COMPLET
 * AVEC EXPORT PDF INTÉGRÉ ✅
 * VERSION AMÉLIORÉE : CARD LARGE + POLICE GRANDE
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/page.tsx
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createCompleteDossier, 
  downloadDossierStrategyPdf, 
  fetchDossierByCode 
} from '@/services/client-api';
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

  // 🔹 États contrôlés pour décisions et lois
  const [decisions, setDecisions] = useState<any[]>([]);
  const [lois, setLois] = useState<any[]>([]);

  // Quand on reçoit un nouveau dossier complet, on initialise décisions/lois
  useEffect(() => {
    if (completedDossier) {
      setDecisions(completedDossier.dossierDecisions || []);
      setLois(completedDossier.dossierLoiArticles || []);
    }
  }, [completedDossier]);

  // 🔹 Helper pour recharger le dossier complet depuis le backend
  async function refreshDossier(code: string) {
    const full = await fetchDossierByCode(code);
    setCompletedDossier(full);
  }

  // ✅ Création du dossier
  async function handleAnalyse(description: string) {
    setLoading(true);
    setError(null);
    setCompletedDossier(null);
    
    const dossierData: NewDossierData = {
      description: description,
    };

    try {
      console.log('🚀 Étape 1/2 : Création du dossier...');
      
      const result = await createCompleteDossier(dossierData);
      console.log('✅ Dossier créé:', result);
      
      const dossierCode = 
        (result as any).dossier?.code ||
        (result as any).code ||
        null;
      
      if (!dossierCode) {
        throw new Error('❌ Code dossier non disponible dans la réponse');
      }
      
      console.log('🔄 Étape 2/2 : Rechargement du dossier complet avec jurisprudences et lois...');
      console.log('📋 Code dossier:', dossierCode);
      
      const fullDossier = await fetchDossierByCode(dossierCode);
      
      console.log('✅ Dossier rechargé avec succès');
      console.log('📚 Jurisprudences trouvées:', fullDossier.dossierDecisions?.length || 0);
      console.log('⚖️ Lois trouvées:', fullDossier.dossierLoiArticles?.length || 0);
      console.log('📝 Stratégie générée:', fullDossier.generatedStrategy ? 'Oui' : 'Non');
      
      setCompletedDossier(fullDossier);
      setCurrentStep(1);
      
    } catch (err: any) {
      console.error('❌ Erreur création:', err);
      const errorMessage = 
        err?.response?.data?.error || 
        err?.message || 
        'Une erreur est survenue lors de la création du dossier.';
      setError(errorMessage);
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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="w-full max-w-7xl mx-auto">
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="w-full max-w-7xl mx-auto">
        <Card className="shadow-2xl border-gray-300 bg-white rounded-2xl">
          <CardHeader className="p-10 border-b border-gray-300">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2 text-base font-semibold">
                   Code Dossier: {(completedDossier as any).code}
                </Badge>
                <CardTitle className="text-4xl font-black text-gray-900 leading-tight">
                  ✅ Dossier Créé avec Succès !
                </CardTitle>
              </div>
              
              <Button 
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                size="lg"
                className="gap-3 bg-green-600 hover:bg-green-700 text-white font-bold whitespace-nowrap px-6 py-6 text-base"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    Télécharger PDF
                  </>
                )}
              </Button>
            </div>

            {pdfError && (
              <div className="p-4 mb-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-base text-red-700 font-semibold">❌ {pdfError}</p>
              </div>
            )}

            <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
          </CardHeader>

          <CardContent className="p-10 min-h-[600px]">
            <div className="text-base leading-relaxed">
              {currentStep === 1 && (
                <StepDetails dossier={completedDossier} />
              )}

              {currentStep === 2 && (
                <StepJurisprudence
                  dossier={completedDossier}
                  decisions={decisions}
                  setDecisions={setDecisions}
                  onDossierUpdated={refreshDossier}
                />
              )}

              {currentStep === 3 && (
                <StepLois
                  dossier={completedDossier}
                  lois={lois}
                  setLois={setLois}
                  onDossierUpdated={refreshDossier}
                />
              )}

              {currentStep === 4 && (
                <StepStrategie dossier={completedDossier} />
              )}
            </div>
          </CardContent>

          <CardFooter className="p-10 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gray-50 rounded-b-2xl border-t border-gray-300">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                size="lg"
                className="px-6 py-6 text-base font-semibold"
              >
                ← Précédent
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNextStep}
                disabled={currentStep === 4}
                size="lg"
                className="gap-2 px-6 py-6 text-base font-semibold"
              >
                Suivant <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCompletedDossier(null);
                  setCurrentStep(1);
                  setPdfError(null);
                  setDecisions([]);
                  setLois([]);
                }}
                size="lg"
                className="px-6 py-6 text-base font-semibold"
              >
                Nouveau Dossier
              </Button>
              <Button 
                onClick={handleDone}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 px-6 py-6 text-base"
              >
                <Download className="w-5 h-5" />
                Consulter le Dossier
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
