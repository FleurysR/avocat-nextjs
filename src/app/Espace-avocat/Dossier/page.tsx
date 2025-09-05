// app/Espace-avocat/dossiers/page.tsx
import { DossiersList } from "@/components/dossiers/DossiersList"; // ➡️ Importez le nouveau composant

export default function DossiersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Mes Dossiers</h2>
      <p className="text-muted-foreground">Gérez vos dossiers juridiques ici.</p>
      
      {/* ➡️ Ajoutez le composant de liste de dossiers ici */}
      <DossiersList />
    </div>
  );
}