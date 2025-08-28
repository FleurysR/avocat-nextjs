// src/app/Espace-avocat/layout.tsx
"use client";
import { ReactNode, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import  AppSidebar  from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/providers";

interface LayoutProps {
  children: ReactNode;
}

export default function EspaceAvocatLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen w-full bg-slate-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
        <AppSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col transition-colors duration-500">
          <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className={`flex-1 p-6 transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}