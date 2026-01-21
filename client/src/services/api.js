import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://YOUR_BACKEND_DOMAIN/api");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANT for cookies
});

export default api;
