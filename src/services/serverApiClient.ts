import axios from "axios";

const serverApiClient = axios.create({
  baseURL: "https://avocat.krypteia.dev/api",
});

// Intercepteur pour ajouter le token JWT à chaque requête
serverApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default serverApiClient;