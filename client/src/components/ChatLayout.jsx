import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useChat } from "../store/chatStore";

const ChatLayout = () => {
  const { activeChat, isSidebarOpen, setActiveChat, openSidebar } = useChat();

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleBack = () => {
    openSidebar();
  };

  return (
    <div className="h-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Sidebar - responsive display */}
      <div
        className={`w-full md:w-[320px] lg:w-[380px] h-full shrink-0 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 block" : "-translate-x-full hidden"} 
          md:translate-x-0 md:block`}
      >
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={handleSelectChat}
        />
      </div>

      {/* Chat Window - responsive display */}
      <div
        className={`flex-1 h-full transition-all duration-300 ease-in-out bg-white dark:bg-slate-950
          ${isSidebarOpen ? "hidden" : "block"} 
          md:block`}
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
