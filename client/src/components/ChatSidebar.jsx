import { memo, useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useChatsQuery } from "../hooks/useChatQueries";
import { useLogoutMutation } from "../hooks/useAuthQueries";
import { useQueryClient } from "@tanstack/react-query";
import { disconnectSocket } from "../socket/socket";
import useChatStore from "../store/chatStore";
import api from "../services/api";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquarePlus,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Users
} from "lucide-react";
import UserList from "./UserList";

// Memoized chat item component
const ChatItem = memo(({ chat, activeChat, setActiveChat, onlineUsers, currentUser }) => {
  const getChatInfo = useCallback(() => {
    if (chat.isGroup) {
      return { name: chat.groupName, otherUser: null };
    }

    const otherUser = chat.members.find((m) => m._id !== currentUser?._id);
    return { name: otherUser?.username || "Chat", otherUser };
  }, [chat, currentUser]);

  const { name, otherUser } = getChatInfo();
  const isOnline = otherUser && onlineUsers.includes(otherUser._id);

  const isActive = activeChat?._id === chat._id;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => setActiveChat(chat)}
      className={`flex items-center gap-3 p-3 mx-2 my-1 cursor-pointer transition-all duration-200 rounded-xl border relative group
        ${
          isActive
            ? "bg-blue-600 dark:bg-blue-600 border-blue-700 dark:border-blue-500 text-white shadow-md shadow-blue-500/10"
            : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
        }`}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className={`w-10 h-10 border shadow-sm ${isActive ? "border-blue-400" : "border-slate-200 dark:border-slate-800"}`}>
          {otherUser?.avatar ? (
            <AvatarImage src={otherUser.avatar} className="object-cover" />
          ) : null}
          <AvatarFallback className={isActive ? "bg-blue-700 text-white font-bold" : "bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-bold"}>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {!chat.isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`font-semibold truncate text-sm ${isActive ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
            {name}
          </p>
        </div>
        <p className={`text-xs truncate mt-0.5 ${isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
          {chat.isGroup ? "Group Conversation" : "Direct Message"}
        </p>
      </div>

      {/* Decorative arrow or indicator */}
      {!isActive && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 text-slate-400">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
      )}
    </motion.div>
  );
});

ChatItem.displayName = "ChatItem";

const ChatSidebar = ({ activeChat: propActiveChat, setActiveChat: propSetActiveChat }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, onlineUsers } = useAuth();
  const { data: chats = [], isLoading } = useChatsQuery();
  const logoutMutation = useLogoutMutation();

  const storeActiveChat = useChatStore((state) => state.activeChat);
  const storeSetActiveChat = useChatStore((state) => state.setActiveChat);

  const activeChat = propActiveChat || storeActiveChat;
  const setActiveChat = propSetActiveChat || storeSetActiveChat;

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      disconnectSocket();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleStartChat = async (selectedUser) => {
    try {
      const res = await api.post("/chats/access", {
        userId: selectedUser._id,
      });

      setActiveChat(res.data);
      setIsNewChatOpen(false);
      queryClient.invalidateQueries(["chats"]);
    } catch (err) {
      console.error("Failed to access chat:", err);
    }
  };

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const name = chat.isGroup
        ? chat.groupName
        : chat.members.find((m) => m._id !== user?._id)?.username || "Chat";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chats, searchQuery, user]);

  return (
    <div className="h-full bg-white dark:bg-slate-900/60 backdrop-blur-md flex flex-col">
      {/* Header */}
      <div className="h-[73px] px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Messages
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
            {chats.length}
          </span>
        </h2>

        {/* New Chat Dialog */}
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            <DialogHeader>
              <DialogTitle>New Chat</DialogTitle>
              <DialogDescription>
                Search for a contact to start a real-time conversation.
              </DialogDescription>
            </DialogHeader>
            <UserList onSelectUser={handleStartChat} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search active chats */}
      <div className="px-4 py-2 relative">
        <Search className="absolute left-7 top-5 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Filter conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-xs h-9"
        />
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">Loading chats...</p>
          </div>
        ) : (
          <div className="py-2">
            <AnimatePresence initial={false}>
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  activeChat={activeChat}
                  setActiveChat={setActiveChat}
                  onlineUsers={onlineUsers}
                  currentUser={user}
                />
              ))}
            </AnimatePresence>

            {!isLoading && filteredChats.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto stroke-[1.5] text-slate-350" />
                <p className="text-sm">No conversations</p>
                <p className="text-xs">Start a chat using the icon above</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-55/40 dark:bg-slate-900/60 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative cursor-pointer" onClick={() => navigate("/profile")}>
            <Avatar className="w-9 h-9 border border-slate-200 dark:border-slate-800 shadow-sm">
              <AvatarImage src={user?.avatar} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
              {user?.username}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-none mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4.5 h-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Profile Details</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4.5 h-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4.5 h-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Log Out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatSidebar);

