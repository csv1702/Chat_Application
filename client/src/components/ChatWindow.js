import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../socket/socket";

const ChatWindow = ({ activeChat }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const bottomRef = useRef(null);

  /* ---------- FETCH MESSAGE HISTORY (REST) ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(
          `/messages/${activeChat._id}`
        );
        setMessages(res.data);
      } catch (error) {
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
    };
  }, [activeChat]);

  /* ---------- RECEIVE REAL-TIME MESSAGE ---------- */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.chat !== activeChat?._id) return;

      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat]);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- SEND MESSAGE (SOCKET ONLY) ---------- */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !joined) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("send_message", {
      chatId: activeChat._id,
      content: newMessage,
    });

    setNewMessage("");
  };

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b font-semibold">
        {activeChat.isGroup
          ? activeChat.groupName
          : "Conversation"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
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
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t flex gap-2"
      >
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
