import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import api from "../services/api";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setShowSidebar(false); // hide sidebar on mobile
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  const handleStartChat = async (selectedUser) => {
    const res = await api.post("/chats/access", {
      userId: selectedUser._id,
    });

    setActiveChat(res.data);
    setShowUsers(false);
    setShowSidebar(false);
  };

  return (
    <div className="h-full flex bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 ${
          showSidebar ? "block" : "hidden"
        } md:block`}
      >
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="p-3 text-blue-600 dark:text-blue-400 font-medium border-b dark:border-gray-700 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {showUsers ? "Back to Chats" : "New Chat"}
        </button>

        {showUsers ? (
          <UserList onSelectUser={handleStartChat} />
        ) : (
          <ChatSidebar
            activeChat={activeChat}
            setActiveChat={handleSelectChat}
          />
        )}
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 ${
          showSidebar ? "hidden" : "block"
        } md:block bg-white dark:bg-gray-950`}
      >
        <ChatWindow
          activeChat={activeChat}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
