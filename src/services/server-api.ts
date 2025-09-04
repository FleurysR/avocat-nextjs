// src/services/serverApi.ts
import axios from "axios";

const serverApi = axios.create({
  baseURL: "https://avocat.krypteia.dev/api",
});

serverApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token"); // récupère token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default serverApi;
