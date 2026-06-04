import { useAuth as useAuthStore } from "../store/authStore";

export const AuthProvider = ({ children }) => children;

export const useAuth = useAuthStore;
