"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, token } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // ✅ Redirection automatique quand token est présent
  useEffect(() => {
    if (token) {
      router.push("/Espace-avocat");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800/80 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-800/90 text-gray-100 shadow-2xl border border-slate-700 rounded-3xl backdrop-blur-lg transition-all duration-500">
        <div className="flex flex-col items-center mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
            <circle cx="6" cy="15" r="3" />
            <circle cx="18" cy="15" r="3" />
          </svg>
          <CardTitle className="text-3xl font-extrabold text-white mt-4">
            Avocat-AI
          </CardTitle>
        </div>

        <CardHeader className="text-center space-y-2 mt-4">
          <CardDescription className="text-gray-300 text-sm">
            Entrez vos informations pour accéder à votre espace sécurisé.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-100">Adresse E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@avocat-ai.com"
                className="bg-slate-700/80 text-gray-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="password" className="text-gray-100">Mot de passe</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-700/80 text-gray-100 border border-slate-600 rounded-lg pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 hover:text-indigo-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? "Connexion..." : "Se Connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
