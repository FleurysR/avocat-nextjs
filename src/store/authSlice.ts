// src/store/authSlice.ts
"use client";

import { AxiosError } from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import clientApi from "@/services/serverApiClient";
import Cookies from "js-cookie";

// Modèle utilisateur (adapte-le à ta structure réelle)
export interface User {
  id: string;
  prenom: string;
  email: string;
  // ... autres champs utiles
}

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: User | null; // <- AJOUTÉ
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
  isAuthenticated: !!getInitialToken(),
  user: null, // <- AJOUTÉ
};

export const loginUser = createAsyncThunk<
  { token: string; user: User },
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await clientApi.post("/login_check", {
      username: email,
      password,
    });

    const token = response.data.token;

    // Option 1 : Retour d'API complet avec user (à adapter à ce que retourne réellement ton backend)
    const user: User = response.data.user;

    if (typeof window !== "undefined") {
      localStorage.setItem("jwt_token", token);
      Cookies.set("jwt_token", token, { expires: 7, secure: true, sameSite: 'strict' });
    }

    return { token, user };
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
      state.user = null; // <- AJOUTÉ
      state.error = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("jwt_token");
        Cookies.remove("jwt_token");
      }
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("jwt_token", action.payload);
        Cookies.set("jwt_token", action.payload, { expires: 7, secure: true, sameSite: 'strict' });
      }
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; // <- AJOUTÉ
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur inconnue";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
