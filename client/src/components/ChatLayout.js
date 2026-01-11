import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setShowSidebar(false); // hide sidebar on mobile
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 ${
          showSidebar ? "block" : "hidden"
        } md:block`}
      >
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={handleSelectChat}
        />
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
