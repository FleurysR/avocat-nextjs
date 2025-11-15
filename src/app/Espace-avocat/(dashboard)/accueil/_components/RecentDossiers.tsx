import { useEffect, useState } from "react";
import { fetchDossiers } from "@/services/client-api";
import { Dossier } from "@/types";
import { FolderKanban } from "lucide-react";
import Link from "next/link";

export const RecentDossiers = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDossiers = async () => {
      setIsLoading(true);
      const response = await fetchDossiers('', 5, 1);
      setDossiers(response.data);
      setIsLoading(false);
    };
    loadDossiers();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mes Dossiers Récents</h3>
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : dossiers.length > 0 ? (
          dossiers.map(dossier => (
            <Link href={`/Espace-avocat/Dossier/${dossier.code}`} key={dossier.code}>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <FolderKanban className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{dossier.objet}</p>
                  <p className="text-xs text-gray-500">Code: {dossier.code}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Aucun dossier récent.</p>
        )}
      </div>
    </div>
  );
};
