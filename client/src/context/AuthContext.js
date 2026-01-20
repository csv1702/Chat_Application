import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../socket/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout for Render free tier
      
      const res = await api.get("/auth/me", { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      setUser(res.data);
      connectSocket();
    } catch (error) {
      // Silently fail - user is not logged in
      console.error("Auth check failed:", error.message);
      setUser(null);
      disconnectSocket();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SOCKET PRESENCE ---------- */
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("user_online", (userId) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    socket.on("user_offline", (userId) => {
      setOnlineUsers((prev) =>
        prev.filter((id) => id !== userId)
      );
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [user]);

  useEffect(() => {
    fetchUser();
    return () => disconnectSocket();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        onlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
