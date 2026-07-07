import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT token if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle errors gracefully (no login redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simply reject — no auth redirect since auth is removed
    return Promise.reject(error);
  }
);

export default api;
