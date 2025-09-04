// src/store/authSlice.ts
"use client";

import { AxiosError } from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import clientApi from "@/services/serverApiClient";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean; // ✅ Nouvel état pour l'authentification
}

interface LoginCredentials {
  email: string;
  password: string;
}

const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

const initialState: AuthState = {
  token: getInitialToken(),
  loading: false,
  error: null,
  isAuthenticated: !!getInitialToken(), // ✅ Détermine l'état initial
};

export const loginUser = createAsyncThunk<
  string,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await clientApi.post("/login_check", {
      username: email,
      password,
    });

    const token = response.data.token;

    if (typeof window !== "undefined") {
      localStorage.setItem("jwt_token", token);
      Cookies.set("jwt_token", token, { expires: 7, secure: true, sameSite: 'strict' });
    }

    return token;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Identifiants invalides");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.error = null;
      state.isAuthenticated = false; // ✅ Mise à jour de l'état
      if (typeof window !== "undefined") {
        localStorage.removeItem("jwt_token");
        Cookies.remove("jwt_token");
      }
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true; // ✅ Mise à jour de l'état
      if (typeof window !== "undefined") {
        localStorage.setItem("jwt_token", action.payload);
        Cookies.set("jwt_token", action.payload, { expires: 7, secure: true, sameSite: 'strict' });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true; // ✅ Indique le succès de la connexion
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur inconnue";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;