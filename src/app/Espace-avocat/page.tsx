// src/app/Espace-avocat/page.tsx

"use client";

import { withAuth } from "@/hoc/withAuth";
import DeepSeekChat from "@/components/DeepSeekChat";
import { GlobalSearchResults } from "@/components/GlobalSearchResults";

function EspaceAvocatPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">
        Bienvenue dans l'espace avocat 
      </h1>
      <p className="text-gray-300 mb-6">
        Ici tu peux gérer tes dossiers, tes clients et toutes tes décisions.
      </p>

      {/* Display search results here */}
      <GlobalSearchResults />

      {/* Chatbot DeepSeek */}
      <DeepSeekChat />
    </div>
  );
}

export default withAuth(EspaceAvocatPage);