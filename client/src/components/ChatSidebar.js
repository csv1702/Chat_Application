import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [chats, setChats] = useState([]);
  const { user, onlineUsers } = useAuth(); // 👈 added onlineUsers

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data);
      } catch (error) {
        console.error("Failed to fetch chats");
      }
    };

    fetchChats();
  }, []);

  const getChatNameAndUser = (chat) => {
    if (chat.isGroup) {
      return { name: chat.groupName, otherUser: null };
    }

    const otherUser = chat.members.find(
      (m) => m._id !== user._id
    );

    return {
      name: otherUser?.username || "Chat",
      otherUser,
    };
  };

  return (
    <div className="h-full bg-white border-r overflow-y-auto">
  <h2 className="text-lg font-semibold p-4 border-b">
    Chats
  </h2>

  {chats.map((chat) => {
    const { name, otherUser } = getChatNameAndUser(chat);
    const isOnline =
      otherUser && onlineUsers.includes(otherUser._id);

    return (
      <div
        key={chat._id}
        onClick={() => setActiveChat(chat)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
          activeChat?._id === chat._id
            ? "bg-blue-50"
            : "hover:bg-gray-100"
        }`}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>

          {!chat.isGroup && isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Name */}
        <div className="flex-1">
          <p className="font-medium">{name}</p>
        </div>
      </div>
    );
  })}
</div>

  );
};

export default ChatSidebar;
