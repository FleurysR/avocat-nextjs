"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import {
  LogOutIcon,
  Home,
  Folders,
  Gavel,
  Scale,
  Briefcase,
  ChevronRight,
  FilePlus,
  BookText,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  href?: string;
  name: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NavItemComponent = ({
  item,
  isActive,
  isParentActive,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  isActive: (path: string) => boolean;
  isParentActive: (path: string) => boolean;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(
    item.subItems ? isParentActive(item.href || "") : false
  );

  // Pour les menus déroulants
  if (item.subItems) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (!isOpen) onToggle();
          }}
          // Pas de classe bg-indigo-500 pour le parent, seulement le hover
          className={`group relative flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
            isOpen ? "gap-3" : "justify-center"
          } hover:bg-gray-200 dark:hover:bg-slate-800`}
        >
          <item.icon className="h-6 w-6" />
          <span className={`flex-1 text-left ${!isOpen && "hidden"}`}>
            {item.name}
          </span>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              isMenuOpen && isOpen ? "rotate-90" : "rotate-0"
            } ${!isOpen && "hidden"}`}
          />
          <Tooltip name={item.name} isOpen={isOpen} />
        </button>
        {isMenuOpen && isOpen && (
          <div
            className={`flex flex-col pl-6 mt-1 space-y-1 transition-all duration-300 ${
              !isOpen && "hidden"
            }`}
          >
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href || ""}
                className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors gap-3 ${
                  isActive(subItem.href || "")
                    ? "bg-indigo-400 text-white dark:bg-indigo-500"
                    : "hover:bg-gray-200 dark:hover:bg-slate-800"
                }`}
              >
                <subItem.icon className="h-5 w-5" />
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Pour les liens simples
  return (
    <Link
      href={item.href || ""}
      className={`group relative flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
        isOpen ? "gap-3" : "justify-center"
      } ${
        isActive(item.href || "")
          ? "bg-indigo-500 text-white dark:bg-indigo-600"
          : "hover:bg-gray-200 dark:hover:bg-slate-800"
      }`}
    >
      <item.icon className="h-6 w-6" />
      <span className={`${!isOpen && "hidden"}`}>{item.name}</span>
      <Tooltip name={item.name} isOpen={isOpen} />
    </Link>
  );
};

const Tooltip = ({ name, isOpen }: { name: string; isOpen: boolean }) =>
  !isOpen && (
    <div className="absolute left-full ml-4 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
      {name}
    </div>
  );

export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/Espace-avocat", name: "Accueil", icon: Home },
    { href: "/Espace-avocat/avocatList", name: "Liste Des Avocat", icon: Folders },
    { href: "/Espace-avocat/decisions", name: "Décision", icon: Gavel },
    {
      name: "Dossier",
      icon: Folders,
      subItems: [
        {
          href: "/Espace-avocat/Dossier",
          name: "Liste des dossiers",
          icon: Folders,
        },
        {
          href: "/Espace-avocat/Dossier/AddDossierForm",
          name: "Créer un nouveau dossier",
          icon: FilePlus,
        },
      ],
    },
    { href: "/Espace-avocat/juridiction", name: "Juridiction", icon: Scale },
    {
        name: "Lois",
    icon: BookText,
    subItems: [
      {
        href: "/Espace-avocat/Lois/categories",
        name: "Catégories de Lois",
        icon: Folders,
      },
      {
        href: "/Espace-avocat/Lois/articles",
        name: "Articles de Lois",
        icon: BookOpen,
      },
      {
        href: "/Espace-avocat/Lois", 
        name: "TOUTES LES LOIS",
        icon: BookOpen,
      },
      ],
    },
  ];

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
        } flex flex-col z-40`}
      >
        <div className="flex items-center h-16 p-4">
          <div
            className={`flex flex-col items-center gap-2 p-2 rounded-md transition-all duration-300 ${
              isOpen ? "justify-start w-full" : "justify-center w-full"
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-sm font-semibold transition-opacity duration-300 ${
                  !isOpen && "opacity-0 hidden"
                }`}
              >
                Avocat-Expert
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              isActive={isActive}
              isParentActive={isParentActive}
              isOpen={isOpen}
              onToggle={onToggle}
            />
          ))}

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              className={`group relative flex items-center p-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors ${
                isOpen ? "gap-3" : "justify-center"
              }`}
              onClick={handleLogoutClick}
            >
              <LogOutIcon className="h-6 w-6" />
              <span className={`${!isOpen && "hidden"}`}>Déconnexion</span>
              <Tooltip name="Déconnexion" isOpen={isOpen} />
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