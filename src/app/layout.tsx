// src/app/layout.tsx

// Ces importations sont nécessaires pour le code client
'use client'; 

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/components/providers"; // Assurez-vous que le chemin est correct
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Ajoutez l'attribut `suppressHydrationWarning`
    <html lang="fr" suppressHydrationWarning>
      <body>
        {/* Placez le ThemeProvider au-dessus du reste de l'application */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}