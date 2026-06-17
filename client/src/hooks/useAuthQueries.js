import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import useAuthStore from "../store/authStore";

// Get current user profile
export const useCurrentUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        return res.data;
      } catch (err) {
        setUser(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({ email, password }) => {
      await api.post("/auth/login", { email, password });
      const res = await api.get("/auth/me");
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["auth", "me"], data);
    },
  });
};

// Register mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async ({ username, email, password }) => {
      const res = await api.post("/auth/register", { username, email, password });
      return res.data;
    },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      resetAuth();
      queryClient.clear();
    },
  });
};
