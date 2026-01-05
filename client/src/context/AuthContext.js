import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  connectSocket,
  disconnectSocket,
} from "../socket/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      connectSocket();
    } catch {
      setUser(null);
      disconnectSocket();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    return () => disconnectSocket();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
