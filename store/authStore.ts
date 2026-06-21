import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "../lib/api";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:        null,
  token:       null,
  loading:     false,
  initialized: false,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync("session_token");
      const raw   = await SecureStore.getItemAsync("user");
      if (token && raw) {
        set({ token, user: JSON.parse(raw), initialized: true });
        // Refresh user data from server
        const { data } = await api.get("/api/users");
        if (data.success) {
          set({ user: data.data });
          await SecureStore.setItemAsync("user", JSON.stringify(data.data));
        }
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/api/auth/mobile/login", { email, password });
      if (!data.success) throw new Error(data.error || "Login failed");
      await SecureStore.setItemAsync("session_token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("session_token");
    await SecureStore.deleteItemAsync("user");
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
