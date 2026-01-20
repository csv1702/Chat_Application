import { useEffect, useState, memo, useMemo, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Memoized chat item component
const ChatItem = memo(({ chat, activeChat, setActiveChat, onlineUsers, user }) => {
  const getChatInfo = useCallback(() => {
    if (chat.isGroup) {
      return { name: chat.groupName, otherUser: null };
    }

    const otherUser = chat.members.find((m) => m._id !== user._id);
    return { name: otherUser?.username || "Chat", otherUser };
  }, [chat, user]);

  const { name, otherUser } = getChatInfo();
  const isOnline = otherUser && onlineUsers.includes(otherUser._id);

  return (
    <div
      key={chat._id}
      onClick={() => setActiveChat(chat)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 border-l-4 hover:scale-[1.01] rounded-r-lg
 ${
        activeChat?._id === chat._id
          ? "bg-blue-600 dark:bg-blue-600 border-blue-700 dark:border-blue-400 text-white"
          : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold ${
          activeChat?._id === chat._id 
            ? "bg-blue-700 dark:bg-blue-500" 
            : "bg-blue-600 dark:bg-blue-700"
        }`}>
          {name.charAt(0).toUpperCase()}
        </div>

        {!chat.isGroup && isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></span>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${
          activeChat?._id === chat._id 
            ? "text-white" 
            : "text-gray-900 dark:text-gray-100"
        }`}>{name}</p>
        <p className={`text-xs truncate ${
          activeChat?._id === chat._id 
            ? "text-blue-100" 
            : "text-gray-500 dark:text-gray-400"
        }`}>
          {chat.isGroup ? "Group chat" : "Tap to open chat"}
        </p>
      </div>
    </div>
  );
});

ChatItem.displayName = "ChatItem";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [chats, setChats] = useState([]);
  const { user, onlineUsers } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats?page=1&limit=50");
        setChats(res.data);
      } catch {
        console.error("Failed to fetch chats");
      }
    };

    fetchChats();
  }, []);

  const memoizedChats = useMemo(() => chats, [chats]);
  const memoizedOnlineUsers = useMemo(() => onlineUsers, [onlineUsers]);

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats ({memoizedChats.length})</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {memoizedChats.map((chat) => (
          <ChatItem
            key={chat._id}
            chat={chat}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            onlineUsers={memoizedOnlineUsers}
            user={user}
          />
        ))}

        {memoizedChats.length === 0 && (
          <p className="text-sm text-gray-500 p-4">
            No chats yet
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(ChatSidebar);
