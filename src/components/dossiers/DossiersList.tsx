"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interface pour nos données de dossier
interface Dossier {
  id: number;
  title: string;
  description: string;
}

// Données statiques initiales
const initialDossiers: Dossier[] = [
  { id: 1, title: "Affaire 2024-001", description: "Dossier de litige commercial." },
  { id: 2, title: "Affaire 2024-002", description: "Consultation juridique pour une startup." },
  { id: 3, title: "Affaire 2024-003", description: "Contentieux du travail." },
];

export function DossiersList() {
  const [dossiers, setDossiers] = useState<Dossier[]>(initialDossiers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddDossier = () => {
    if (!newTitle || !newDescription) {
      toast.error("Veuillez remplir tous les champs pour ajouter un dossier.");
      return;
    }
    const newDossier: Dossier = {
      id: Date.now(), // ID unique basé sur le timestamp
      title: newTitle,
      description: newDescription,
    };
    setDossiers([...dossiers, newDossier]);
    setNewTitle("");
    setNewDescription("");
    toast.success("✅ Dossier ajouté avec succès.");
    
  };

  const handleUpdateDossier = (id: number) => {
    if (!newTitle || !newDescription) {
      toast.error("Veuillez remplir tous les champs pour modifier un dossier.");
      return;
    }
    const updatedDossiers = dossiers.map((dossier) =>
      dossier.id === id ? { ...dossier, title: newTitle, description: newDescription } : dossier
    );
    setDossiers(updatedDossiers);
    setEditingId(null);
    setNewTitle("");
    setNewDescription("");
    toast.info("ℹ️ Dossier modifié avec succès.");
  };

  const handleDeleteDossier = (id: number) => {
    const updatedDossiers = dossiers.filter((dossier) => dossier.id !== id);
    setDossiers(updatedDossiers);
    toast.error("🗑️ Dossier supprimé.");
  };

  const startEditing = (dossier: Dossier) => {
    setEditingId(dossier.id);
    setNewTitle(dossier.title);
    setNewDescription(dossier.description);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter/Modifier un dossier</CardTitle>
          <CardDescription>
            Remplissez les champs pour ajouter un nouveau dossier ou modifier celui en cours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Titre du dossier"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            placeholder="Description du dossier"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          {editingId ? (
            <div className="flex gap-2">
              <Button onClick={() => handleUpdateDossier(editingId)}>
                <Pencil className="mr-2 h-4 w-4" />Modifier
              </Button>
              <Button variant="secondary" onClick={() => setEditingId(null)}>
                Annuler
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddDossier}>
              <PlusCircle className="mr-2 h-4 w-4" />Ajouter
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dossiers.map((dossier) => (
          <Card key={dossier.id}>
            <CardHeader>
              <CardTitle>{dossier.title}</CardTitle>
              <CardDescription>{dossier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2">
              <Button variant="outline" size="icon" onClick={() => startEditing(dossier)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteDossier(dossier.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}