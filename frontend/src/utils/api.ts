import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10000,
});

// Automatically inject JWT authentication headers
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("aura-auth-storage");
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          // Zustand wraps the state inside a .state node
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Failed to parse auth token:", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        try {
          // Dynamic require to prevent circular dependency at load time
          const { useAuthStore } = require("@/store/useAuthStore");
          useAuthStore.getState().logout();
          
          // Force redirect to login page if not already there
          if (!window.location.pathname.startsWith("/auth")) {
            window.location.href = `/auth?mode=login&redirect=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`;
          }
        } catch (e) {
          console.error("Error during auto-logout on 401:", e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
