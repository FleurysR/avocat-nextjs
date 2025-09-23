// src/app/Espace-avocat/layout.tsx

"use client";

import { ReactNode, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import AppSidebar from "@/components/app-sidebar";
import { SearchProvider } from "@/components/context/SearchContext";
import ToasterProvider from "@/components/ProviderToaster";

interface LayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100">
      <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="sticky top-0 z-10">
          <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function EspaceAvocatLayout({ children }: LayoutProps) {
  return (
    // Wrap your application with the correct providers
    <ToasterProvider attribute="class" defaultTheme="system" enableSystem>
      <SearchProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </SearchProvider>
    </ToasterProvider>
  );
}