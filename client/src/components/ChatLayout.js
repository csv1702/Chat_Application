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
    <div className="h-full flex">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 ${
          showSidebar ? "block" : "hidden"
        } md:block`}
      >
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="p-3 text-blue-600 font-medium border-b w-full text-left hover:bg-gray-50"
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
        } md:block`}
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
