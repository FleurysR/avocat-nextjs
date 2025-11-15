"use client";

/**
 * =====================================================
 * COMPOSANT : FORMULAIRE INITIAL
 * =====================================================
 * Fichier: src/app/Espace-avocat/Dossier/AddDossierForm/components/InitialForm.tsx
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface InitialFormProps {
  onAnalyse: (description: string) => void;
  loading: boolean;
  error: string | null;
}

export default function InitialForm({ 
  onAnalyse, 
  loading, 
  error 
}: InitialFormProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAnalyse(description);
  };

  return (
    <Card className="shadow-lg border-gray-300 bg-white w-full max-w-4xl mx-auto p-8 md:p-12 rounded-2xl">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Sparkles className="text-indigo-600 w-8 h-8" />
          </div>
        </div>
        <CardTitle className="text-4xl font-extrabold text-gray-900">
            Décrivez votre nouveau cas
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          {/* Décrivez-moi la situation du litige et je vais générer un dossier complet automatiquement. */}
          <span className="block mt-2 font-semibold text-indigo-600">
            Fournissez une description libre de l'affaire. Notre IA extraira les informations clés pour pré-remplir votre dossier.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Exemple : Mon client, la société 'TechCorp', n'a pas été payé pour une prestation de développement logiciel livrée le 15 mars dernier..."
            className="resize-none min-h-[180px] text-base p-4 border-gray-300 focus:ring-2 focus:ring-indigo-500 rounded-xl bg-white"
            disabled={loading}
            autoFocus
          />
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button 
            type="submit" 
            disabled={loading || !description.trim()} 
            size="lg" 
            className="font-semibold text-base py-6 gap-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            {loading ? 'Génération en cours... ⏳' : 'Générer le Dossier Complet'}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            ⏱️ Cela peut prendre 30-60 secondes selon la complexité
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
