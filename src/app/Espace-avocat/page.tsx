"use client";

import { withAuth } from "@/hoc/withAuth";

function EspaceAvocatPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">
        Bienvenue dans l'espace avocat 👩‍⚖️
      </h1>
      <p className="text-gray-300">
        Ici tu peux gérer tes dossiers, tes clients et toutes tes décisions.
      </p>
    </div>
  );
}

export default withAuth(EspaceAvocatPage);
