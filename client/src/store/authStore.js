import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  onlineUsers: [],

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, onlineUsers: [] }),
  setLoading: (loading) => set({ loading }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  addOnlineUser: (userId) =>
    set((state) =>
      state.onlineUsers.includes(userId)
        ? state
        : { onlineUsers: [...state.onlineUsers, userId] }
    ),
  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((id) => id !== userId),
    })),
  resetAuth: () => set({ user: null, loading: false, onlineUsers: [] }),
}));

export default useAuthStore;

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setOnlineUsers = useAuthStore((state) => state.setOnlineUsers);
  const addOnlineUser = useAuthStore((state) => state.addOnlineUser);
  const removeOnlineUser = useAuthStore((state) => state.removeOnlineUser);
  const resetAuth = useAuthStore((state) => state.resetAuth);

  return {
    user,
    loading,
    onlineUsers,
    setUser,
    clearUser,
    setLoading,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    resetAuth,
  };
};

