import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "https://mercy-hub.vercel.app";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("session_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("session_token");
      await SecureStore.deleteItemAsync("user");
    }
    return Promise.reject(error);
  }
);
