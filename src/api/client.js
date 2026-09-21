import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Auth Token Helpers ────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem("spend_tracker_token");
export const setToken = (token) => localStorage.setItem("spend_tracker_token", token);
export const removeToken = () => localStorage.removeItem("spend_tracker_token");

// Attach Bearer token to every outgoing request if available
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// ── Auth Endpoints ────────────────────────────────────────────────────────────

export const login = (username, password) =>
  client.post("/auth/login", { username, password });

export const register = (username, password) =>
  client.post("/auth/register", { username, password });

export const logout = async () => {
  try {
    await client.post("/auth/logout");
  } catch (err) {
    console.warn("Server logout notification skipped:", err);
  } finally {
    removeToken();
  }
};

export const getMe = () => client.get("/auth/me");

// ── Expenses ──────────────────────────────────────────────────────────────────

export const createExpense = (data) => client.post("/expenses", data);

export const listExpenses = (params = {}) =>
  client.get("/expenses", { params });

// ── Summary ───────────────────────────────────────────────────────────────────

export const getSummary = () => client.get("/summary");
