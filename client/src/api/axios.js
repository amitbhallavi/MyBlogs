import axios from "axios";

const normalizeBaseURL = (value) => {
  const url = (value || "").trim().replace(/\/+$/, "");
  return url.includes("your-render-backend-url") ? "" : url;
};

const configuredBaseURL = normalizeBaseURL(import.meta.env.VITE_API_URL);
const localApiTarget = normalizeBaseURL(import.meta.env.VITE_API_TARGET);

export const authRedirectBaseURL = configuredBaseURL || localApiTarget;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return authRedirectBaseURL ? `${authRedirectBaseURL}${normalizedPath}` : normalizedPath;
};

const api = axios.create({
  baseURL: configuredBaseURL || undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
