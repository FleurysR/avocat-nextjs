// src/app/Espace-avocat/decision/page.tsx
import serverApi from "@/services/server-api";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Decision } from "@/types";

export default async function DecisionsPage() {
  // Récupération du token côté serveur
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token')?.value;

  if (!token) {
    redirect('/login'); // redirection si non connecté
  }

  let decisions: Decision[] = [];
  let error: string | null = null;

  try {
    const response = await serverApi.get("/decisions");
    // Récupérer les données dans le format attendu
    decisions = Array.isArray(response.data) ? response.data : response.data?.hits || [];
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    error = e.response?.data?.message || "Erreur lors de la récupération des décisions";
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="p-6 rounded-lg shadow-lg bg-red-100 dark:bg-red-900 border border-red-500">
          <p className="text-red-500 font-bold text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-500 pb-2">
          Mes Décisions
        </h1>

        {decisions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Aucune décision trouvée pour le moment.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {decisions.map((decision) => (
              <li
                key={decision.code}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                <h2 className="font-semibold text-lg text-indigo-700 dark:text-indigo-400 mb-2">
                  {decision.numeroDossier} - {decision.objet}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Président de la chambre : {decision.presidentChambre}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Date de décision : {new Date(decision.decisionAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Score de pertinence : {decision._rankingScore.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
