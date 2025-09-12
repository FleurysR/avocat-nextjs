"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { LogOutIcon, Home, Folders, Gavel, Scale, Briefcase, ChevronRight, FilePlus } from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // État pour gérer l'ouverture et la fermeture du sous-menu Dossier
  const [isDossierMenuOpen, setIsDossierMenuOpen] = useState(
    pathname.startsWith("/Espace-avocat/dossiers")
  );

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    router.push("/login");
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const isActive = (path: string) => pathname === path;
  const isParentActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-all duration-500 ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        {/* En-tête avec le logo et la ligne stylisée */}
        <div className="flex items-center h-16 p-4">
          <div
            className={`flex flex-col items-center gap-2 p-2 rounded-md transition-all duration-300 ${
              isOpen ? "justify-start w-full" : "justify-center w-full"
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              {/* Logo: Remplacé par une icône de mallette (Briefcase) */}
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              {/* Nom de l'application */}
              <span
                className={`text-sm font-semibold transition-opacity duration-300 ${
                  !isOpen && "opacity-0 hidden"
                }`}
              >
                Avocat-Expert
              </span>
            </div>
            {/* Ligne stylisée en dessous */}
            {/* <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-500 mt-2 rounded-full"></div> */}
          </div>
        </div>

        {/* Menu de navigation */}
        <nav className="flex flex-col flex-1 p-4 space-y-2">
          {/* Accueil - Reste en haut */}
          <Link
            href="/Espace-avocat"
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            } ${
              isActive("/Espace-avocat")
                ? "bg-indigo-500 text-white dark:bg-indigo-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Accueil</span>
          </Link>

          {/* Menus classés par ordre alphabétique */}
          <Link
            href="/Espace-avocat/avocatList"
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            } ${
              isActive("/Espace-avocat/avocatList")
                ? "bg-indigo-500 text-white dark:bg-indigo-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
          >
            <Folders className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Liste Des Avocat</span>
          </Link>
          
          <Link
            href="/Espace-avocat/decision"
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            } ${
              isActive("/Espace-avocat/decision")
                ? "bg-indigo-500 text-white dark:bg-indigo-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
          >
            <Gavel className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Décision</span>
          </Link>

          {/* Nouveau menu déroulant "Dossier" */}
          <div className="flex flex-col">
            <button
              onClick={() => {
                setIsDossierMenuOpen(!isDossierMenuOpen);
                if (!isOpen) onToggle(); // Ouvre la barre latérale si elle est fermée
              }}
              className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                isOpen ? "gap-3" : "justify-center"
              } ${
                isParentActive("/Espace-avocat/dossiers")
                  ? "bg-indigo-500 text-white dark:bg-indigo-600"
                  : "hover:bg-gray-200 dark:hover:bg-slate-800"
              }`}
            >
              <Folders className="h-6 w-6" />
              <span className={`flex-1 text-left ${!isOpen && "hidden"}`}>
                Dossier
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isDossierMenuOpen && isOpen ? "rotate-90" : "rotate-0"
                } ${!isOpen && "hidden"}`}
              />
            </button>
            {isDossierMenuOpen && (
              <div
                className={`flex flex-col pl-6 mt-1 space-y-1 transition-all duration-300 ${
                  !isOpen && "hidden"
                }`}
              >
                <Link
                  href="/Espace-avocat/Dossier"
                  className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors gap-3 ${
                    isActive("/Espace-avocat/Dossier")
                      ? "bg-indigo-400 text-white dark:bg-indigo-500"
                      : "hover:bg-gray-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <Folders className="h-5 w-5" />
                  Liste des dossiers
                </Link>
                <Link
                  href="/Espace-avocat/Dossier/AddDossierForm"
                  className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors gap-3 ${
                    isActive("/Espace-avocat/Dossier/AddDossierForm")
                      ? "bg-indigo-400 text-white dark:bg-indigo-500"
                      : "hover:bg-gray-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <FilePlus className="h-5 w-5" />
                  Créer un nouveau dossier
                </Link>
              </div>
            )}
          </div>
          
          <Link
            href="/Espace-avocat/juridiction"
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            } ${
              isActive("/Espace-avocat/juridiction")
                ? "bg-indigo-500 text-white dark:bg-indigo-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
          >
            <Scale className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Jirudiction</span>
          </Link>

          <Link
            href="/Espace-avocat/loi"
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            } ${
              isActive("/Espace-avocat/loi")
                ? "bg-indigo-500 text-white dark:bg-indigo-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-800"
            }`}
          >
            <Scale className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Lois & Articles</span>
          </Link>


          {/* Déconnexion */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              className={`flex items-center p-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors ${
                isOpen ? "gap-3" : "justify-center"
              }`}
              onClick={handleLogoutClick}
            >
              <LogOutIcon className="h-6 w-6" />
              <span className={`${!isOpen && "hidden"}`}>Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl w-80">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirmer la déconnexion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
