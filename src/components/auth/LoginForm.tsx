"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-lg w-96"
    >
      <h1 className="text-xl font-bold text-center">Connexion</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
        Se connecter
      </Button>
    </form>
  );
}
