import axios from "axios";
import { cookies } from 'next/headers';

const serverApi = axios.create({
  baseURL: "https://avocat.krypteia.dev/api",
});

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default serverApi;