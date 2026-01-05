import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useState } from "react";

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r">
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>

      {/* Chat Window */}
      <div className="w-2/3">
        <ChatWindow activeChat={activeChat} />
      </div>
    </div>
  );
};

export default ChatLayout;
