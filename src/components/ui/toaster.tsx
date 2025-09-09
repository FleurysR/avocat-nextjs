"use client";

import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

export const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      closeButton // Ajout de cette propriété pour afficher le bouton de fermeture.
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
      {...props}
    />
  );
};
