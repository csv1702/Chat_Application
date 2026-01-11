import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [chats, setChats] = useState([]);
  const { user, onlineUsers } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data);
      } catch {
        console.error("Failed to fetch chats");
      }
    };

    fetchChats();
  }, []);

  /* ---------- GET CHAT NAME + USER ---------- */
  const getChatInfo = (chat) => {
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
    <div className="h-full bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const { name, otherUser } = getChatInfo(chat);
          const isActive = activeChat?._id === chat._id_vis;
          const isOnline =
            otherUser &&
            onlineUsers.includes(otherUser._id);

          return (
            <div
              key={chat._id}
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-l-4 ${
                activeChat?._id === chat._id
                  ? "bg-blue-50 border-blue-600"
                  : "border-transparent hover:bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>

                {!chat.isGroup && isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {chat.isGroup
                    ? "Group chat"
                    : "Tap to open chat"}
                </p>
              </div>
            </div>
          );
        })}

        {chats.length === 0 && (
          <p className="text-sm text-gray-500 p-4">
            No chats yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
