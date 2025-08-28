"use client";

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setToken } from "@/store/authSlice";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const Protected: React.FC<P> = (props) => {
    const { token } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // ✅ Ajout d'un état de chargement

    useEffect(() => {
      // 💡 Cette logique ne s'exécute que côté client
      const storedToken = localStorage.getItem("jwt_token");
      if (storedToken) {
        dispatch(setToken(storedToken));
      } else {
        router.replace("/login");
      }
      setIsLoading(false); // ✅ Le chargement est terminé
    }, [dispatch, router]);

    // ✅ Rendu conditionnel basé sur l'état de chargement et le jeton
    if (isLoading || !token) {
      return <div>Loading...</div>; // 💡 Affichez un état de chargement qui correspond au serveur
    }

    return <WrappedComponent {...props} />;
  };

  return Protected;
}