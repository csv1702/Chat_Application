import { useEffect, useRef, useState, memo } from "react";
import { useAuth } from "../store/authStore";
import { getSocket } from "../socket/socket";
import MessageStatusIcon from "./MessageStatusIcon";
import ImageUpload from "./ImageUpload";
import MediaDisplay from "./MediaDisplay";
import { useMessagesQuery, useDeleteMessageMutation, useClearChatMutation } from "../hooks/useChatQueries";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Trash2,
  Send,
  MessageCircle,
  Clock
} from "lucide-react";

const TYPING_TIMEOUT = 2000;

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWindow = ({ activeChat, onBack }) => {
  const queryClient = useQueryClient();
  const { user, onlineUsers } = useAuth();

  const { data: messages = [], isLoading } = useMessagesQuery(activeChat?._id);
  const deleteMutation = useDeleteMessageMutation(activeChat?._id);
  const clearChatMutation = useClearChatMutation(activeChat?._id);

  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* ---------- SAFE OTHER USER ---------- */
  const otherUser =
    activeChat &&
    !activeChat.isGroup &&
    Array.isArray(activeChat.members)
      ? activeChat.members.find(
          (m) => m._id !== user._id
        )
      : null;

  const isOnline =
    otherUser && onlineUsers.includes(otherUser._id);

  /* ---------- JOIN CHAT ROOM ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_chat", activeChat._id);
    setJoined(true);

    return () => {
      setJoined(false);
      setTypingUser(null);
    };
  }, [activeChat]);

  /* ---------- RECEIVE MESSAGES ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.chat !== activeChat._id) return;
      queryClient.setQueryData(["messages", activeChat._id], (prev = []) => [...prev, message]);
      setTypingUser(null);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat, queryClient]);

  /* ---------- TYPING EVENTS ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    const handleTyping = ({ userId, username }) => {
      if (userId === user._id) return;
      setTypingUser(username);
    };

    const handleStopTyping = ({ userId }) => {
      if (userId === user._id) return;
      setTypingUser(null);
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [activeChat, user._id]);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  /* ---------- MESSAGE DELETION LISTENER ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    const handleMessageDeleted = ({ messageId }) => {
      queryClient.setQueryData(["messages", activeChat._id], (prev = []) =>
        prev.filter((m) => m._id !== messageId)
      );
    };

    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [activeChat, queryClient]);

  /* ---------- INPUT CHANGE ---------- */
  const handleTypingChange = (e) => {
    setNewMessage(e.target.value);

    if (!joined || !activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("typing", {
      chatId: activeChat._id,
      userId: user._id,
      username: user.username,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        chatId: activeChat._id,
        userId: user._id,
      });
    }, TYPING_TIMEOUT);
  };

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !joined || !activeChat) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("send_message", {
      chatId: activeChat._id,
      content: newMessage,
    });

    socket.emit("stop_typing", {
      chatId: activeChat._id,
      userId: user._id,
    });

    setNewMessage("");
  };

  /* ---------- HANDLE MEDIA UPLOAD ---------- */
  const handleMediaUpload = (message) => {
    queryClient.setQueryData(["messages", activeChat._id], (prev = []) => [...prev, message]);
    
    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", {
        chatId: activeChat._id,
        content: message.content,
      });
    }
  };

  /* ---------- DELETE MESSAGE ---------- */
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMutation.mutateAsync(messageId);

      const socket = getSocket();
      socket.emit("delete_message", {
        messageId,
        chatId: activeChat._id,
      });
    } catch {
      alert("Failed to delete message");
    }
  };

  /* ---------- CLEAR ALL MESSAGES ---------- */
  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear all messages in this conversation?")) return;

    try {
      await clearChatMutation.mutateAsync();
    } catch {
      alert("Failed to clear chat");
    }
  };

  /* ---------- UI GUARD (SAFE PLACE) ---------- */
  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
            <MessageCircle className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Start a Conversation</h3>
          <p className="text-xs max-w-sm mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
            Select an active conversation from the sidebar or click the new message icon to find contacts.
          </p>
        </motion.div>
      </div>
    );
  }

  const headerName = activeChat.isGroup ? activeChat.groupName : (otherUser?.username || "Chat");

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="h-[73px] px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex items-center gap-3 shrink-0">
        {/* Back button (mobile only) */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          className="md:hidden rounded-full text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="relative">
          <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            <AvatarImage src={otherUser?.avatar} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold">
              {headerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!activeChat.isGroup && otherUser && (
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
          )}
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {headerName}
          </p>

          {!activeChat.isGroup && otherUser && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {isOnline ? "Active now" : "Offline"}
            </p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClearChat}
                className="w-9 h-9 rounded-full text-red-500 hover:text-red-650 hover:bg-red-500/10"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Chat History</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg, index) => {
          const senderId =
            typeof msg.sender === "string"
              ? msg.sender
              : msg.sender._id;

          const isOwn = senderId === user._id;

          return (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              key={msg._id || index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col gap-1 max-w-[70%] group relative">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm break-words whitespace-pre-wrap shadow-sm leading-relaxed border relative
                    ${
                      isOwn
                        ? "bg-blue-600 border-blue-700 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-150 rounded-bl-none"
                    }`}
                >
                  <p>{msg.content}</p>

                  <MediaDisplay attachments={msg.attachments} messageType={msg.messageType} />
                </div>

                {/* Subtext info (timestamp + status checks) */}
                <div className={`flex items-center gap-1 mt-0.5 text-[10px] text-slate-450 dark:text-slate-500 ${isOwn ? "justify-end" : "justify-start"}`}>
                  <span>{formatTime(msg.createdAt)}</span>
                  {isOwn && <MessageStatusIcon message={msg} userId={user._id} />}
                </div>

                {/* Floating Delete Message Action button */}
                {isOwn && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="absolute top-1/2 -translate-y-1/2 -left-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white dark:bg-slate-850 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm z-10"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Bouncing Typing Dot Animation Bubble */}
        {typingUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-slate-500"
          >
            <Avatar className="w-6 h-6 border border-slate-200 dark:border-slate-850 shadow-sm shrink-0">
              <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                {typingUser.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 px-3.5 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex items-center gap-2 shrink-0"
      >
        <ImageUpload onUpload={handleMediaUpload} activeChat={activeChat} />

        <Input
          className="flex-1 rounded-full border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-visible:ring-blue-500 text-sm h-10"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTypingChange}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full shrink-0 shadow-md transition-all active:scale-95"
        >
          <Send className="w-4.5 h-4.5" />
        </Button>
      </form>
    </div>
  );
};

export default memo(ChatWindow);

