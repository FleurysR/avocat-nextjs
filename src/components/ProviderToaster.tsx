"use client";

import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { X } from "lucide-react";

export default function ToasterProvider({ children, ...props }: any) {
  const { theme } = useTheme();

  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster 
        theme={theme as "light" | "dark"} 
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          classNames: {
            // Ces styles sont bons
            toast: "rounded-xl border p-4 shadow-lg border-gray-200 bg-white text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white",
            error: "bg-red-500 text-white dark:bg-red-700",
            success: "bg-green-500 text-white dark:bg-green-700",
            warning: "bg-yellow-400 text-black dark:bg-yellow-600 dark:text-white",
            info: "bg-blue-500 text-white dark:bg-blue-700",
            description: "text-sm text-gray-700 dark:text-gray-300",
            actionButton: "text-blue-500 dark:text-blue-300",
            cancelButton: "text-gray-500 dark:text-gray-400",
          },
        }}
        icons={{
          // 🚀 Utilisez une icône de base sans aucun style ni conteneur.
          // Laissez le composant 'sonner' faire le travail de stylisation.
          close: <X className="h-4 w-4" />,
        }}
      />
    </NextThemesProvider>
  );
}