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
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b">
        Chats
      </h2>

      {chats.map((chat) => {
        const { name, otherUser } =
          getChatNameAndUser(chat);

        const isOnline =
          otherUser &&
          onlineUsers.includes(otherUser._id);

        return (
          <div
            key={chat._id}
            onClick={() => setActiveChat(chat)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 flex items-center justify-between ${
              activeChat?._id === chat._id
                ? "bg-gray-200"
                : ""
            }`}
          >
            {/* Chat name */}
            <p className="font-medium">{name}</p>

            {/* Online indicator */}
            {!chat.isGroup && isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatSidebar;
