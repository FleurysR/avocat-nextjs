// src/services/client-api.ts
import axios from "axios";

const clientApi = axios.create({
  baseURL: "https://avocat.krypteia.dev/api",
});

clientApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default clientApi;