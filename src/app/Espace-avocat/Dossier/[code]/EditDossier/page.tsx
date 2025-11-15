"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { 
  fetchDossierByCode,
  updateDossier,
} from "@/services/client-api";

import { DossierDetails } from "@/types";

const steps = ["Détails", "Jurisprudence", "Lois", "Stratégie"];

export default function EditDossierPage() {
  const params = useParams();
  const router = useRouter();
  const dossierCode = params.code as string;

  const [step, setStep] = useState(0);
  const [dossier, setDossier] = useState<DossierDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Champs adaptés à votre backend Symfony
  const [formData, setFormData] = useState({
    description: "",              // ✅ Backend: description
    juridictionDesignation: "",   // ✅ Frontend seulement (extrait de juridiction.designation)
    chambreDesignation: "",       // ✅ Frontend seulement (extrait de chambreJuridique.designation)
    stylePlaidoirieDesignation: "", // ✅ Frontend (extrait de stylePlaidoirie.designation)
    solutionDesignation: "",      // ✅ Frontend (extrait de solutionJuridique.designation)
    objet: "",                    // ✅ Backend: objet
    matiere: "",                  // ✅ Backend: matiere
    resume: "",                   // ✅ Backend: resume
    objectif: "",                 // ✅ Backend: objectif
    faits: "",                    // ✅ Backend: faits
    preuves: "",                  // ✅ Backend: preuves
    pointFort: "",                // ✅ Backend: pointFort
    pointFaible: "",              // ✅ Backend: pointFaible
    generatedStrategy: "",        // ✅ Backend: generatedStrategy
  });

  // 📥 Charger le dossier
  useEffect(() => {
    async function loadDossier() {
      try {
        setLoading(true);
        
        const data = await fetchDossierByCode(dossierCode);
        setDossier(data);

        // ✅ Adapter selon votre backend
        setFormData({
          description: data.description || "",
          juridictionDesignation: data.juridiction?.designation || "",
          chambreDesignation: data.chambreJuridique?.designation || "",
          stylePlaidoirieDesignation: data.stylePlaidoirie?.designation || "",
          solutionDesignation: data.solutionJuridique?.designation || "",
          objet: data.objet || "",
          matiere: data.matiere || "",
          resume: data.resume || "",
          objectif: data.objectif || "",
          faits: data.faits || "",
          preuves: data.preuves || "",
          pointFort: data.pointFort || "",
          pointFaible: data.pointFaible || "",
          generatedStrategy: data.generatedStrategy || "",
        });
      } catch (err: any) {
        console.error("Erreur chargement:", err);
        setError(err.message || "Erreur lors du chargement du dossier");
      } finally {
        setLoading(false);
      }
    }

    if (dossierCode) loadDossier();
  }, [dossierCode]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // 💾 Sauvegarder - Appel à PUT /api/dossiers/{code}
  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      // ✅ Envoyer SEULEMENT les champs que votre backend attend
      const updated = await updateDossier(dossierCode, {
        description: formData.description,
        objet: formData.objet,
        matiere: formData.matiere,
        resume: formData.resume,
        objectif: formData.objectif,
        faits: formData.faits,
        preuves: formData.preuves,
        pointFort: formData.pointFort,
        pointFaible: formData.pointFaible,
        // generatedStrategy: formData.generatedStrategy,
      });

      setDossier(updated);
      alert("✅ Dossier mis à jour avec succès !");
    } catch (err: any) {
      console.error("Erreur sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const progressPercentage = ((step + 1) / steps.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (error && !dossier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Barre de progression */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full w-12 h-12 flex items-center justify-center text-white font-bold transition-all ${
                    step > i ? "bg-blue-600" : step === i ? "bg-blue-500" : "bg-slate-700"
                  }`}
                >
                  {step > i ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                </div>
                <span className={`mt-2 text-sm ${step >= i ? "text-blue-400" : "text-slate-500"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-4 transition-all ${step > i ? "bg-blue-600" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
        </div>

        <div className="flex justify-end mb-6">
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          
          {/* ÉTAPE 1 : Détails */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  1. Révision des Détails du Dossier
                </h2>
              </div>

              <div className="space-y-4">
                
                {/* Description */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Description initiale</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange("description")}
                  />
                </div>

                {/* Grille : Juridiction, Chambre, Solution, Style */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Juridiction */}
                  <div>
                    <label className="block text-slate-300 text-sm mb-2 font-semibold">Juridiction</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                      value={formData.juridictionDesignation}
                      onChange={handleChange("juridictionDesignation")}
                      disabled
                      placeholder="Juridiction (lecture seule)"
                    />
                    <p className="text-xs text-slate-500 mt-1">💡 Modifiable via le backend uniquement</p>
                  </div>

                  {/* Chambre */}
                  <div>
                    <label className="block text-slate-300 text-sm mb-2 font-semibold">Chambre juridique</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                      value={formData.chambreDesignation}
                      onChange={handleChange("chambreDesignation")}
                      disabled
                      placeholder="Chambre (lecture seule)"
                    />
                    <p className="text-xs text-slate-500 mt-1">💡 Modifiable via le backend uniquement</p>
                  </div>

                  {/* Style de plaidoirie */}
                  <div>
                    <label className="block text-slate-300 text-sm mb-2 font-semibold">Style de plaidoirie</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                      value={formData.stylePlaidoirieDesignation}
                      onChange={handleChange("stylePlaidoirieDesignation")}
                      disabled
                      placeholder="Style (lecture seule)"
                    />
                    <p className="text-xs text-slate-500 mt-1">💡 Modifiable via le backend uniquement</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <label className="block text-slate-300 text-sm mb-2 font-semibold">Solution Souhaitée</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                      value={formData.solutionDesignation}
                      onChange={handleChange("solutionDesignation")}
                      disabled
                      placeholder="Solution (lecture seule)"
                    />
                    <p className="text-xs text-slate-500 mt-1">💡 Modifiable via le backend uniquement</p>
                  </div>
                </div>

                {/* Objet */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Objet</label>
                  <textarea
                    className="w-full bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    rows={3}
                    value={formData.objet}
                    onChange={handleChange("objet")}
                  />
                </div>

                {/* Matière */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Matière</label>
                  <textarea
                    className="w-full bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    rows={2}
                    value={formData.matiere}
                    onChange={handleChange("matiere")}
                  />
                </div>

                {/* Résumé */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Résumé</label>
                  <textarea
                    className="w-full bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    rows={4}
                    value={formData.resume}
                    onChange={handleChange("resume")}
                  />
                </div>

                {/* Objectif */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Objectif</label>
                  <textarea
                    className="w-full bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    rows={3}
                    value={formData.objectif}
                    onChange={handleChange("objectif")}
                  />
                </div>

                {/* Faits */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Faits et dates pertinents</label>
                  <textarea
                    className="w-full bg-red-950/20 border border-red-900/50 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    rows={4}
                    value={formData.faits}
                    onChange={handleChange("faits")}
                  />
                </div>

                {/* Preuves */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Preuves</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                    rows={3}
                    value={formData.preuves}
                    onChange={handleChange("preuves")}
                  />
                </div>

                {/* Points Forts */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Points Forts</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                    rows={3}
                    value={formData.pointFort}
                    onChange={handleChange("pointFort")}
                  />
                </div>

                {/* Points Faibles */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 font-semibold">Points Faibles</label>
                  <textarea
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
                    rows={3}
                    value={formData.pointFaible}
                    onChange={handleChange("pointFaible")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Jurisprudence */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">2. Jurisprudence</h2>
              <div className="space-y-4">
                {(dossier?.dossierDecisions || []).length > 0 ? (
                  dossier?.dossierDecisions?.map((d, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                      <h4 className="text-white font-semibold">{d.decision.objet}</h4>
                      <p className="text-slate-400 text-sm mt-2">{d.decision.code}</p>
                      <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        Score: {d.scorePertinence.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Aucune jurisprudence trouvée.</p>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Lois */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">3. Lois et Articles</h2>
              <div className="space-y-4">
                {(dossier?.dossierLoiArticles || []).length > 0 ? (
                  dossier?.dossierLoiArticles?.map((a, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                      <h4 className="text-white font-semibold">Article {a.loiArticle.numero}</h4>
                      <p className="text-slate-400 text-sm mt-2">{a.loiArticle.content}</p>
                      <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                        Score: {a.scorePertinence.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Aucun article trouvé.</p>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : Stratégie */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">4. Stratégie Juridique</h2>
              <textarea
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white font-mono text-sm"
                rows={12}
                value={formData.generatedStrategy}
                onChange={handleChange("generatedStrategy")}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            {step > 0 && (
              <Button onClick={prevStep} variant="outline" className="border-slate-700">
                Retour
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={nextStep} className="ml-auto bg-blue-600 hover:bg-blue-700">
                Suivant
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving} className="ml-auto bg-green-600 hover:bg-green-700">
                {saving ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
