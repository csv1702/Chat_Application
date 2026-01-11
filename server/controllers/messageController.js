const Message = require("../models/Message");
const Chat = require("../models/Chat");

/* ---------------- SEND MESSAGE ---------------- */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res
        .status(400)
        .json({ message: "Chat ID and content required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = await Message.create({
      sender: req.userId,
      chat: chatId,
      content,
      messageType: "text",
      readBy: [req.userId],
    });

    chat.updatedAt = new Date();
    await chat.save();

    const populatedMessage = await message.populate(
      "sender",
      "username avatar"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ---------------- GET MESSAGES BY CHAT ---------------- */
exports.getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(messages.reverse());
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* ---------------- DELETE SINGLE MESSAGE ---------------- */
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await message.deleteOne();

    res.json({ message: "Message deleted", messageId });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
};

/* ---------------- CLEAR CHAT HISTORY ---------------- */
exports.clearChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.deleteMany({ chat: chatId });

    res.json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("Clear chat error:", error);
    res.status(500).json({ message: "Failed to clear chat" });
  }
};
