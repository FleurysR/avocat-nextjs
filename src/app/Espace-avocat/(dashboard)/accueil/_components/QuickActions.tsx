import { FilePlus, Search, BookOpen } from "lucide-react";
import Link from "next/link";

const actions = [
  { label: "Nouveau Dossier", icon: FilePlus, href: "/Espace-avocat/Dossier/AddDossierForm", color: "bg-sidebar-primary hover:bg-sidebar-primary/90" },
  { label: "Rechercher Décision", icon: Search, href: "/Espace-avocat/decisions", color: "bg-gray-700 hover:bg-gray-600" },
  { label: "Consulter les Lois", icon: BookOpen, href: "/Espace-avocat/Lois", color: "bg-gray-700 hover:bg-gray-600" },
];

export const QuickActions = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accès Rapide</h3>
     <div className="flex flex-col space-y-3">
        {actions.map(action => (
          <Link href={action.href} key={action.label}>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg text-white text-sm font-medium transition-colors ${action.color}`}>
              <action.icon className="h-5 w-5" />
              <span>{action.label}</span>
            </button>
          </Link>
        ))}
     </div>
  </div>
);
