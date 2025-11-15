// MultiStepForm.jsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

import { useState } from "react";

const steps = [
  "Détails",
  "Jurisprudence",
  "Lois",
  "Stratégie"
];

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    descriptionInitiale: "",
    juridiction: "",
    chambre: "",
    solution: "",
    stylePlaidoirie: "",
    strategie: "",
    objet: "",
    matiere: "",
    resume: "",
    objectif: "",
    faits: "",
    preuves: "",
    pointsForts: "",
    pointsFaibles: ""
  });

  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
  };

  return (
    <div className="bg-background min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ProgressBar */}
        <div className="flex items-center gap-6 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center text-white
                ${step >= i ? 'bg-primary' : 'bg-muted'}`}>
                {step > i ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="h-1 w-12 bg-muted mx-2"></div>
              )}
            </div>
          ))}
        </div>
        <Progress value={((step + 1) / steps.length) * 100} className="mb-8" />

        <Card>
          <CardContent className="p-8">
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">1. Révision des Détails du Dossier</h2>
                <div className="space-y-4">
                  <Textarea
                    label="Description initiale"
                    placeholder="Entrez la description…"
                    value={values.descriptionInitiale}
                    onChange={handleChange("descriptionInitiale")}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select value={values.juridiction} onValueChange={val => setValues(v => ({ ...v, juridiction: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Juridiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tribunal de commerce">Tribunal de commerce</SelectItem>
                        <SelectItem value="Chambre commerciale">Chambre commerciale</SelectItem>
                        {/* Ajoutez d'autres options ici */}
                      </SelectContent>
                    </Select>
                    <Select value={values.chambre} onValueChange={val => setValues(v => ({ ...v, chambre: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chambre juridique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chambre commerciale">Chambre commerciale</SelectItem>
                        {/* Ajoutez d'autres options ici */}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    label="Solution Souhaitée"
                    placeholder="Résolution, Résiliation…"
                    value={values.solution}
                    onChange={handleChange("solution")}
                  />
                  <Input
                    label="Style de plaidoirie"
                    placeholder="Technique"
                    value={values.stylePlaidoirie}
                    onChange={handleChange("stylePlaidoirie")}
                  />
                  <Input
                    label="Stratégie proposée"
                    placeholder="Offensive directe"
                    value={values.strategie}
                    onChange={handleChange("strategie")}
                  />
                  <Textarea
                    label="Objet"
                    placeholder="Litige relatif à la demande…"
                    value={values.objet}
                    onChange={handleChange("objet")}
                  />
                  <Input
                    label="Matière"
                    placeholder="Droit des contrats"
                    value={values.matiere}
                    onChange={handleChange("matiere")}
                  />
                  <Textarea
                    label="Résumé"
                    placeholder="Résumé du litige…"
                    value={values.resume}
                    onChange={handleChange("resume")}
                  />
                  <Textarea
                    label="Objectif"
                    placeholder="Obtenir la résiliation…"
                    value={values.objectif}
                    onChange={handleChange("objectif")}
                  />
                  <Textarea
                    label="Faits et dates"
                    placeholder="Signature du contrat..."
                    value={values.faits}
                    onChange={handleChange("faits")}
                  />
                  <Textarea
                    label="Preuves"
                    placeholder="Contrat, correspondances, etc."
                    value={values.preuves}
                    onChange={handleChange("preuves")}
                  />
                  <Textarea
                    label="Points Forts"
                    placeholder="Le fournisseur est soumis à…"
                    value={values.pointsForts}
                    onChange={handleChange("pointsForts")}
                  />
                  <Textarea
                    label="Points Faibles"
                    placeholder="La société X a signé un contrat…"
                    value={values.pointsFaibles}
                    onChange={handleChange("pointsFaibles")}
                  />
                </div>
              </>
            )}
            {/* Ajoutez l'affichage pour chaque étape ici (Jurisprudence, Lois, Stratégie) */}
            <div className="flex justify-end mt-8 gap-4">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Précédent
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Suivant
                </Button>
              ) : (
                <Button type="submit">
                  Générer le dossier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
