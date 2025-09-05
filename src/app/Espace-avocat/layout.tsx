"use client";

import { ReactNode, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import AppSidebar from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/providers";
import { SearchProvider, useSearch } from "@/components/context/SearchContext";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps { children: ReactNode }

function AppLayoutContent({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setSearchTerm } = useSearch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="sticky top-0 z-10">
          <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onSearch={setSearchTerm} />
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function EspaceAvocatLayout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SearchProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </SearchProvider>
      <Toaster />
    </ThemeProvider>
  );
  
}
