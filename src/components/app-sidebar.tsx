// src/components/AppSidebar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { LogOutIcon, Home, Folders, Gavel, Scale } from "lucide-react";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`fixed top-0 left-0 h-screen border-r border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-all duration-500 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Header avec logo */}
      <div className="flex items-center h-16 p-4 border-b border-gray-200 dark:border-gray-700">
        <div
          className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center w-full"
          } bg-gray-200/50 dark:bg-gray-800/50 shadow-sm dark:shadow-lg`}
        >
          {/* Logo */}
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 dark:bg-indigo-400 rounded-full">
            <span className="text-white font-bold">A</span>
          </div>

          {/* Nom de l’application */}
          <span
            className={`text-sm font-semibold transition-opacity duration-300 ${
              !isOpen && "opacity-0 hidden"
            }`}
          >
            Avocat-Expert
          </span>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex flex-col flex-1 p-4 space-y-2">
        <Link
          href="/Espace-avocat"
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
            isOpen ? "gap-3" : "justify-center"
          } ${
            isActive("/Espace-avocat")
              ? "bg-indigo-500 text-white dark:bg-indigo-600"
              : "hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className={`${!isOpen && "hidden"}`}>Accueil</span>
        </Link>

        <Link
          href="/Espace-avocat/avocatList"
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
            isOpen ? "gap-3" : "justify-center"
          } ${
            isActive("/Espace-avocat/dossiers")
              ? "bg-indigo-500 text-white dark:bg-indigo-600"
              : "hover:bg-gray-200 dark:hover:bg-white/10"
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
              : "hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
        >
          <Gavel className="h-6 w-6" />
          <span className={`${!isOpen && "hidden"}`}>Décision</span>
        </Link>

        <Link
          href="/Espace-avocat/loi"
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
            isOpen ? "gap-3" : "justify-center"
          } ${
            isActive("/Espace-avocat/loi")
              ? "bg-indigo-500 text-white dark:bg-indigo-600"
              : "hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
        >
          <Scale className="h-6 w-6" />
          <span className={`${!isOpen && "hidden"}`}>Lois & Articles</span>
        </Link>

        <Link
          href="/Espace-avocat/juridiction"
          className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
            isOpen ? "gap-3" : "justify-center"
          } ${
            isActive("/Espace-avocat/juridiction")
              ? "bg-indigo-500 text-white dark:bg-indigo-600"
              : "hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
        >
          <Scale className="h-6 w-6" />
          <span className={`${!isOpen && "hidden"}`}>Jirudiction</span>
        </Link>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className={`flex items-center p-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${
              isOpen ? "gap-3" : "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOutIcon className="h-6 w-6" />
            <span className={`${!isOpen && "hidden"}`}>Déconnexion</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
