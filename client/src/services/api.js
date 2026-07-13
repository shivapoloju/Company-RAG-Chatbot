import axios from "axios";

let apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (apiBaseURL && !apiBaseURL.endsWith("/api") && !apiBaseURL.endsWith("/api/")) {
  apiBaseURL = apiBaseURL.endsWith("/") ? `${apiBaseURL}api` : `${apiBaseURL}/api`;
}

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;