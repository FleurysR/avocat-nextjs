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
        // Passe le thème actuel à la notification pour qu'elle puisse s'adapter.
        theme={theme as "light" | "dark"} 
        richColors
        closeButton
        position="top-right"
        // Ajoute des styles personnalisés pour les différents types de notifications
        toastOptions={{
          classNames: {
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
          close: <X className="h-4 w-4" />,
        }}
      />
    </NextThemesProvider>
  );
}
