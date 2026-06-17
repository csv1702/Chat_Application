import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

// Fetch chats
export const useChatsQuery = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.get("/chats?page=1&limit=50");
      return res.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

// Fetch messages for a specific chat
export const useMessagesQuery = (chatId) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await api.get(`/messages/${chatId}`);
      return res.data;
    },
    enabled: !!chatId,
    staleTime: Infinity, // Messages are managed in real-time by sockets, no auto-refetch
  });
};

// Delete a message mutation
export const useDeleteMessageMutation = (chatId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId) => {
      await api.delete(`/messages/${messageId}`);
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData(["messages", chatId], (prev = []) =>
        prev.filter((m) => m._id !== messageId)
      );
    },
  });
};

// Clear chat mutation
export const useClearChatMutation = (chatId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/messages/chat/${chatId}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["messages", chatId], []);
    },
  });
};
