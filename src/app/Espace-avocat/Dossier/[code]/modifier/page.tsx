"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchDossierByCode, updateDossier } from "@/services/client-api";
import { DossierDetails, NewDossierData } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function EditDossierPage() {
    const { code } = useParams<{ code: string }>();
    const [dossierData, setDossierData] = useState<NewDossierData | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Récupération des données initiales et conversion
    useEffect(() => {
        if (!code) return;
        fetchDossierByCode(code as string)
            .then(data => {
                // Créer un objet de type NewDossierData à partir des données de l'API
                const transformedData: NewDossierData = {
                    objet: data.objet,
                    matiere: data.matiere,
                    description: data.description || '', // Gérer les valeurs facultatives
                    objectif: data.objectif || '',
                    faits: data.faits,
                    resume: data.resume,
                    preuves: data.preuves,
                    pointFort: data.pointFort || '',
                    pointFaible: data.pointFaible || '',
                    // ✅ Transformer les objets en chaînes de caractères (code)
                    juridiction: data.juridiction?.code || '',
                    chambreJuridique: data.chambreJuridique?.code || '',
                    solutionJuridique: data.solutionJuridique?.code || '',
                    strategy: data.strategy?.code || '',
                    stylePlaidoirie: data.stylePlaidoirie?.code || '',
                    keywords: data.keywords || [],
                    contextualTerms: data.contextualTerms || [],
                };
                setDossierData(transformedData);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Erreur lors du chargement des données du dossier.");
                setLoading(false);
            });
    }, [code]);

    // 2. Gestion des changements dans le formulaire (correct)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDossierData(prev => ({
            ...prev!, // Utilisation de l'opérateur non-null assert `!`
            [name]: value,
        }));
    };
    
    // 3. Soumission du formulaire (correct)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !dossierData) return;
        
        const toastId = toast.loading("Mise à jour du dossier...", { id: "update-toast" });

        try {
            await updateDossier(code as string, dossierData);
            toast.success("Dossier mis à jour avec succès !", { id: toastId });
            // Redirection ou autre action après succès
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du dossier.", { id: toastId });
        }
    };
    
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner variant="ring" size={60} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      );
    }
    
    // 4. Rendu du formulaire (similaire à votre code précédent)
    return (
        <div className="container mx-auto max-w-screen-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Modifier le Dossier : {dossierData?.objet}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="objet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Objet
                    </label>
                    <input 
                        type="text" 
                        id="objet" 
                        name="objet" 
                        value={dossierData?.objet || ''} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    
                </div>
                {/* Ajoutez ici les autres champs de votre formulaire */}
                
                <Button type="submit">Sauvegarder les modifications</Button>
            </form>
        </div>
    );
}