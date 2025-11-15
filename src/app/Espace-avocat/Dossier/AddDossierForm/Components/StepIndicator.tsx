"use client";

/**
 * =====================================================
 * COMPOSANT : INDICATEUR D'ÉTAPES
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/StepIndicator.tsx
 */

import React from 'react';
import { FileText, Gavel, Scale, BrainCircuit, CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({ 
  currentStep, 
  onStepClick 
}: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Détails', icon: <FileText className="w-4 h-4" /> },
    { number: 2, label: 'Jurisprudence', icon: <Gavel className="w-4 h-4" /> },
    { number: 3, label: 'Lois', icon: <Scale className="w-4 h-4" /> },
    { number: 4, label: 'Stratégie', icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.number}>
          <button
            onClick={() => onStepClick(step.number)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all ${
              currentStep === step.number
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : currentStep > step.number
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
            disabled={currentStep < step.number}
          >
            {currentStep > step.number ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              step.icon
            )}
            <span className="text-xs font-semibold hidden sm:block">{step.label}</span>
          </button>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 rounded ${
              currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
            }`} style={{ width: '60px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
