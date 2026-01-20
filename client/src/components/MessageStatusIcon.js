const MessageStatusIcon = ({ message, userId }) => {
  if (!message.sender || message.sender._id !== userId) {
    return null; // Only show for own messages
  }

  const isRead = message.readBy && message.readBy.length > 1;
  const isDelivered = message.readBy && message.readBy.length > 0;

  if (!isDelivered) {
    return (
      <span title="Sending..." className="text-gray-400 text-xs ml-1">
        ⏱
      </span>
    );
  }

  if (isRead) {
    return (
      <span title="Read" className="text-blue-500 text-xs ml-1 font-bold">
        ✓✓
      </span>
    );
  }

  return (
    <span title="Delivered" className="text-gray-500 text-xs ml-1">
      ✓✓
    </span>
  );
};

export default MessageStatusIcon;
