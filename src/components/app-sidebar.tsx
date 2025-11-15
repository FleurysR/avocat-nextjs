// CHEMIN : src/components/app-sidebar.tsx

"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";

// --- INTERFACES ---
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

// =======================================================
// SOUS-COMPOSANT NavItemComponent (CORRIGÉ)
// =======================================================
const NavItemComponent = ({
  item,
  isOpen,
  onToggle,
  pathname, // pathname est bien une prop
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}) => {
  const isActive = (path: string) => pathname === path;
  // La fonction isParentActive est maintenant définie ici
  const isParentActive = (path: string) => item.href ? pathname.startsWith(item.href) : false;

  // On initialise l'état directement en utilisant la fonction et la prop
  const [isMenuOpen, setIsMenuOpen] = useState(() => isParentActive(pathname));

  // LE USEEFFECT EST SUPPRIMÉ CAR IL EST INUTILE ET CAUSAIT L'ERREUR

  if (item.subItems) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (!isOpen) onToggle();
          }}
          className={`group relative flex items-center p-3 rounded-lg text-sm font-medium transition-colors w-full ${
            isOpen ? "gap-3" : "justify-center"
          } hover:bg-gray-200 dark:hover:bg-slate-800`}
        >
          <item.icon className="h-6 w-6" />
          <span className={`flex-1 text-left ${!isOpen && "hidden"}`}>{item.name}</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${isMenuOpen && isOpen ? "rotate-90" : "rotate-0"} ${!isOpen && "hidden"}`} />
          <Tooltip name={item.name} isOpen={isOpen} />
        </button>
        {isMenuOpen && isOpen && (
          <div className={`flex flex-col pl-6 mt-1 space-y-1 transition-all duration-300 ${!isOpen && "hidden"}`}>
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href || ""}
                className={`flex items-center p-2 rounded-lg text-sm font-medium transition-colors gap-3 ${
                  isActive(subItem.href || "")
                    ? "bg-sidebar-primary text-white dark:bg-sidebar-primary"
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

  return (
    <Link
      href={item.href || ""}
      className={`group relative flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
        isOpen ? "gap-3" : "justify-center"
      } ${
        isActive(item.href || "")
          ? "bg-sidebar-primary text-white dark:bg-sidebar-primary"
          : "hover:bg-gray-200 dark:hover:bg-slate-800"
      }`}
    >
      <item.icon className="h-6 w-6" />
      <span className={`${!isOpen && "hidden"}`}>{item.name}</span>
      <Tooltip name={item.name} isOpen={isOpen} />
    </Link>
  );
};


// =======================================================
// SOUS-COMPOSANT Tooltip
// =======================================================
const Tooltip = ({ name, isOpen }: { name: string; isOpen: boolean }) =>
  !isOpen ? (
    <div className="absolute left-full ml-4 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
      {name}
    </div>
  ) : null;


// =======================================================
// COMPOSANT PRINCIPAL AppSidebar
// =======================================================
export default function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname(); // La déclaration est ici, au bon endroit
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/Espace-avocat/accueil", name: "Dashboard", icon: Home },
    { href: "/Espace-avocat/avocatList", name: "Liste Des Avocats", icon: Folders },
    { href: "/Espace-avocat/decisions", name: "Décisions", icon: Gavel },
    { name: "Dossiers", icon: Briefcase, href: "/Espace-avocat/Dossier", subItems: [
        { href: "/Espace-avocat/Dossier", name: "Liste des dossiers", icon: Folders },
        { href: "/Espace-avocat/Dossier/AddDossierForm", name: "Créer un nouveau dossier", icon: FilePlus },
      ],
    },
    { href: "/Espace-avocat/juridiction", name: "Juridictions", icon: Scale },
    { name: "Lois", icon: BookText, href: "/Espace-avocat/Lois", subItems: [
        { href: "/Espace-avocat/Lois/categories", name: "Catégories de Lois", icon: Folders },
        { href: "/Espace-avocat/Lois/articles", name: "Articles de Lois", icon: BookOpen },
        { href: "/Espace-avocat/Lois", name: "Toutes Les Lois", icon: BookOpen },
      ],
    },
  ];

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  const cancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <>
      <div className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} flex flex-col z-40 border-r border-gray-200 dark:border-slate-800`}>
        <div className="flex items-center h-20 p-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-sidebar-primary rounded-full">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className={`text-lg font-bold transition-opacity duration-300 ${!isOpen && "opacity-0 hidden"}`}>
              Avocat-Expert
            </span>
          </div>
        </div>

        <nav className="flex flex-col flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.name}
              item={item}
              isOpen={isOpen}
              onToggle={onToggle}
              pathname={pathname} // On passe bien la prop ici
            />
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleLogoutClick}
              className={`group relative flex items-center p-3 rounded-lg text-sm font-medium w-full hover:bg-red-500/10 hover:text-red-500 transition-colors ${isOpen ? "gap-3" : "justify-center"}`}
            >
              <LogOutIcon className="h-6 w-6" />
              <span className={`${!isOpen && "hidden"}`}>Déconnexion</span>
              <Tooltip name="Déconnexion" isOpen={isOpen} />
            </button>
          </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-sm m-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Confirmer la déconnexion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={cancelLogout}>Annuler</Button>
              <Button variant="destructive" onClick={confirmLogout}>Confirmer</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
