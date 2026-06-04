import { useEffect } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import { connectSocket, disconnectSocket } from "../socket/socket";

const AuthBootstrap = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const addOnlineUser = useAuthStore((state) => state.addOnlineUser);
  const removeOnlineUser = useAuthStore((state) => state.removeOnlineUser);
  const user = useAuthStore((state) => state.user);
  const resetChatUi = useChatStore((state) => state.resetChatUi);

  useEffect(() => {
    let isActive = true;

    const bootstrapAuth = async () => {
      try {
        const response = await api.get("/auth/me");

        if (!isActive) return;

        setUser(response.data);
      } catch (error) {
        if (!isActive) return;

        clearUser();
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isActive = false;
    };
  }, [clearUser, setLoading, setUser]);

  useEffect(() => {
    if (!user) {
      resetChatUi();
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleUserOnline = (userId) => {
      addOnlineUser(userId);
    };

    const handleUserOffline = (userId) => {
      removeOnlineUser(userId);
    };

    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      disconnectSocket();
    };
  }, [user, addOnlineUser, removeOnlineUser, resetChatUi]);

  return children;
};

export default AuthBootstrap;
