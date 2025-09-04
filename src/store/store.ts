// src/store/store.ts
'use client';

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchReducer from "./searchSlice"; // <-- import du nouveau slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer, // <-- ajout du slice search
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
