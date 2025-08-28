"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Button
        onClick={() => (window.location.href = "/login")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95"
      >
        Aller au login
      </Button>
    </div>
  );
}
