import { useEffect, useRef, useState, memo } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket/socket";
import MessageStatusIcon from "./MessageStatusIcon";
import ImageUpload from "./ImageUpload";
import MediaDisplay from "./MediaDisplay";

const TYPING_TIMEOUT = 2000;

const ChatWindow = ({ activeChat, onBack }) => {

  const { user, onlineUsers } = useAuth();

  const [messages, setMessages] = useState([]);
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

  /* ---------- FETCH MESSAGE HISTORY ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/messages/${activeChat._id}`
        );
        setMessages(res.data);
      } catch {
        console.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [activeChat]);

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
      setMessages((prev) => [...prev, message]);
      setTypingUser(null);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat]);

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
    const socket = getSocket();
    if (!socket) return;

    socket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((m) => m._id !== messageId)
      );
    });

    return () => {
      socket.off("message_deleted");
    };
  }, []);

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
    setMessages((prev) => [...prev, message]);
    
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
      await api.delete(`/messages/${messageId}`);
      setMessages((prev) =>
        prev.filter((m) => m._id !== messageId)
      );

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
    if (!window.confirm("Clear all messages?")) return;

    try {
      await api.delete(`/messages/chat/${activeChat._id}`);
      setMessages([]);
    } catch {
      alert("Failed to clear chat");
    }
  };

  /* ---------- UI GUARD (SAFE PLACE) ---------- */
  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
  {/* Back button (mobile only) */}
  <button
    onClick={onBack}
    className="md:hidden text-blue-600 dark:text-blue-400 font-medium"
  >
    ←
  </button>

  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
    {(activeChat.isGroup
      ? activeChat.groupName
      : otherUser?.username
    )
      ?.charAt(0)
      .toUpperCase()}
  </div>

  <div>
    <p className="font-medium text-gray-900 dark:text-white">
      {activeChat.isGroup
        ? activeChat.groupName
        : otherUser?.username}
    </p>

    {!activeChat.isGroup && otherUser && (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {isOnline ? "Online" : "Offline"}
      </p>
    )}
  </div>

  <button
    onClick={handleClearChat}
    className="ml-auto text-sm text-red-600 dark:text-red-400 hover:underline"
  >
    Clear Chat
  </button>
</div>


      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "string"
              ? msg.sender
              : msg.sender._id;

          const isOwn = senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap shadow transition-all duration-200 ease-out ${
    isOwn
      ? "bg-blue-600 text-white rounded-br-none translate-y-0"
      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
  }`}
>
                <div className="relative group">
                  <div className="flex items-center gap-1">
                    <p>{msg.content}</p>
                    {isOwn && <MessageStatusIcon message={msg} userId={user._id} />}
                  </div>

                  <MediaDisplay attachments={msg.attachments} messageType={msg.messageType} />

                  {isOwn && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="absolute -top-2 -right-2 hidden group-hover:block text-xs bg-red-500 text-white rounded px-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {typingUser && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic animate-pulse">
            {typingUser} is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2"
      >
        <ImageUpload onUpload={handleMediaUpload} activeChat={activeChat} />

        <input
          className="flex-1 rounded-full border dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTypingChange}
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-95 text-white px-5 rounded-full transition transform duration-150">
          Send
        </button>
      </form>
    </div>
  );
};

export default memo(ChatWindow);
