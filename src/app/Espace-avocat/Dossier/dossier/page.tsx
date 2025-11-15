import MultiStepForm from "@/components/MultiStepForm";

export default function DossierPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Assistant Juridique</h1>
          <p className="text-slate-400 mt-2">Créez votre dossier en quelques étapes</p>
        </div>
      </header>

      <main>
        <MultiStepForm />
      </main>
    </div>
  );
}