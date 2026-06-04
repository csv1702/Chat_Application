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

export const useAuth = () =>
  useAuthStore((state) => ({
    user: state.user,
    loading: state.loading,
    onlineUsers: state.onlineUsers,
    setUser: state.setUser,
    clearUser: state.clearUser,
    setLoading: state.setLoading,
    setOnlineUsers: state.setOnlineUsers,
    addOnlineUser: state.addOnlineUser,
    removeOnlineUser: state.removeOnlineUser,
    resetAuth: state.resetAuth,
  }));
