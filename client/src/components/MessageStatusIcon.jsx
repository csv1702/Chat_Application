import { Check, CheckCheck, Clock } from "lucide-react";

const MessageStatusIcon = ({ message, userId }) => {
  if (!message.sender || (typeof message.sender === "string" ? message.sender : message.sender._id) !== userId) {
    return null; // Only show for own messages
  }

  const isRead = message.readBy && message.readBy.length > 1;
  const isDelivered = message.readBy && message.readBy.length > 0;

  if (!isDelivered) {
    return (
      <Clock title="Sending..." className="w-3 h-3 text-slate-300/80 ml-1 inline-block shrink-0" />
    );
  }

  if (isRead) {
    return (
      <CheckCheck title="Read" className="w-3.5 h-3.5 text-blue-400 ml-1 inline-block shrink-0" />
    );
  }

  return (
    <Check title="Delivered" className="w-3.5 h-3.5 text-slate-300/85 ml-1 inline-block shrink-0" />
  );
};

export default MessageStatusIcon;

