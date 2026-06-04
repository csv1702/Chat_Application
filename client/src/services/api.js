import axios from "axios";

const baseUrl =
  process.env.REACT_APP_API_BASE_URL ??
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://YOUR_BACKEND_DOMAIN");

const API_URL = baseUrl.endsWith("/api")
  ? baseUrl
  : `${baseUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANT for cookies
});

export default api;
