"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/authSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/Espace-avocat");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800/80 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-800/90 text-gray-100 shadow-2xl border border-slate-700 rounded-3xl backdrop-blur-lg transition-all duration-500">
        <div className="flex flex-col items-center mt-8 mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-1.25-3M3 6h18M3 6v10a2 2 0 002 2h14a2 2 0 002-2V6M3 6l2.25-4h13.5L21 6" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              AvocatAI-Pro
            </CardTitle>
          </div>

          <CardTitle className="text-2xl font-semibold text-white mt-8">
            Connexion Expert
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm mt-1">
            Plateforme juridique intelligente
          </CardDescription>
        </div>

        <CardContent className="px-6 pb-6">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email professionnel</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@cabinet.com"
                  className="bg-slate-700/80 text-gray-100 border border-slate-600 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-700/80 text-gray-100 border border-slate-600 rounded-lg pl-10 pr-12 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded"
                />
                <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">Se souvenir de moi</Label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Mot de passe oublié?</span>
              </Link>
            </div>

            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Connexion..." : (
                <>
                  Se connecter <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <span className="absolute bg-slate-800/90 px-2 text-gray-400 text-sm">Nouveau sur Plateforme AvocatAI Pro?</span>
            <div className="w-full border-t border-slate-700"></div>
          </div>

          <Link href="/register">
            <Button
              variant="outline"
              className="w-full border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={18} /> Créer un compte expert
            </Button>
          </Link>
        </CardContent>

        <div className="text-center text-xs text-gray-500 mt-6 mb-4">
          <p>© 2025 AvocatAI Pro. Tous droits réservés.</p>
          <p className="mt-1">
            <Link href="/privacy" className="text-indigo-400 hover:underline">Confidentialité</Link> &middot;{" "}
            <Link href="/terms" className="text-indigo-400 hover:underline">Conditions</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}