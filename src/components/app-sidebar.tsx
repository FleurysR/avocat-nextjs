"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { LogOutIcon, Home, Folders, Gavel } from "lucide-react";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    //dispatch(logout());
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`flex flex-col min-h-screen border-r border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-all duration-500 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Header avec un logo amélioré */}
      <div className="flex items-center h-16 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${isOpen ? 'justify-start' : 'justify-center w-full'} bg-gray-200/50 dark:bg-gray-800/50 shadow-sm dark:shadow-lg`}>
          {/* Icône du logo (visible dans les deux états) */}
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.992a4.5 4.5 0 010 6.364L12 20.364l-7.618-7.618a4.5 4.5 0 010-6.364 4.5 4.5 0 016.364 0L12 7.636l1.254-1.254a4.5 4.5 0 016.364 0z" />
          </svg>
          
          {/* Texte du logo (visible uniquement si le sidebar est ouvert) */}
          <span className={`text-sm font-semibold transition-opacity duration-300 ${!isOpen && 'opacity-0 hidden'}`}>Avocat-Expert</span>
        </div>
      </div>

      {/* Menu de navigation amélioré */}
      <nav className="flex flex-col flex-1 p-4 space-y-2">
        <Link 
          href="/Espace-avocat" 
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${isOpen ? 'gap-3' : 'justify-center'} ${isActive("/Espace-avocat") ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
        >
          <Home className="h-6 w-6" /> <span className={`${!isOpen && 'hidden'}`}>Accueil</span>
        </Link>
        <Link 
          href="/Espace-avocat/dossiers" 
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${isOpen ? 'gap-3' : 'justify-center'} ${isActive("/Espace-avocat/dossiers") ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
        >
          <Folders className="h-6 w-6" /> <span className={`${!isOpen && 'hidden'}`}>Mes dossiers</span>
        </Link>

        <Link 
          href="/Espace-avocat/decision" 
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${isOpen ? 'gap-3' : 'justify-center'} ${isActive("/Espace-avocat/decision") ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
        >
          <Gavel className="h-6 w-6" /> <span className={`${!isOpen && 'hidden'}`}>Décision</span>
        </Link>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className={`flex items-center p-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${isOpen ? 'gap-3' : 'justify-center'}`}
            onClick={handleLogout}
          >
            <LogOutIcon className="h-6 w-6" /> <span className={`${!isOpen && 'hidden'}`}>Déconnexion</span>
          </button>
        </div>
      </nav>
    </div>
  );
}