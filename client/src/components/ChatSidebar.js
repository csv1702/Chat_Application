import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        console.log("Chats API response:", res.data);//hhhhhhh
        setChats(res.data);
      } catch (error) {
        console.error("Failed to fetch chats");
      }
    };

    fetchChats();
  }, []);

  console.log("Logged in user:", user);


  const getChatName = (chat) => {
    if (chat.isGroup) return chat.groupName;
    const otherUser = chat.members.find(
      (m) => m._id !== user._id
    );
    return otherUser?.username || "Chat";
  };

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b">
        Chats
      </h2>

      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setActiveChat(chat)}
          className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
            activeChat?._id === chat._id
              ? "bg-gray-200"
              : ""
          }`}
        >
          <p className="font-medium">{getChatName(chat)}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
