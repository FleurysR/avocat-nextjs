import axios from "axios";

const serverApiClient = axios.create({
  baseURL: "https://127.0.0.1:8000/api",
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