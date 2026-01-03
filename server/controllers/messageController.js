const Message = require("../models/Message");
const Chat = require("../models/Chat");

/* ---------------- SEND MESSAGE ---------------- */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ message: "Chat ID and content required" });
    }

    // Ensure chat exists and user is member
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = await Message.create({
      sender: req.userId,
      chat: chatId,
      content,
      readBy: [req.userId],
    });

    // Update chat activity
    chat.updatedAt = new Date();
    await chat.save();

    res.status(201).json(message);
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
