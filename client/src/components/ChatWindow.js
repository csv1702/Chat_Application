const ChatWindow = ({ activeChat }) => {
  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b font-semibold">
        {activeChat.isGroup
          ? activeChat.groupName
          : "Conversation"}
      </div>

      {/* Messages area (placeholder for now) */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-400">
          Messages will appear here
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
