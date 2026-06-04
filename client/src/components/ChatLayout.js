import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import api from "../services/api";
import useChatStore from "../store/chatStore";

const ChatLayout = () => {
  const activeChat = useChatStore((state) => state.activeChat);
  const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
  const showUserList = useChatStore((state) => state.showUserList);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const openSidebar = useChatStore((state) => state.openSidebar);
  const toggleShowUserList = useChatStore(
    (state) => state.toggleShowUserList
  );
  const setShowUserList = useChatStore((state) => state.setShowUserList);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleBack = () => {
    openSidebar();
  };

  const handleStartChat = async (selectedUser) => {
    const res = await api.post("/chats/access", {
      userId: selectedUser._id,
    });

    setActiveChat(res.data);
    setShowUserList(false);
  };

  return (
    <div className="h-full flex bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <button
          onClick={toggleShowUserList}
          className="p-3 text-blue-600 dark:text-blue-400 font-medium border-b dark:border-gray-700 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {showUserList ? "Back to Chats" : "New Chat"}
        </button>

        {showUserList ? (
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
          isSidebarOpen ? "hidden" : "block"
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
