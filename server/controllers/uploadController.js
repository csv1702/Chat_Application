const Message = require("../models/Message");
const Chat = require("../models/Chat");

/* ---------- UPLOAD FILE/IMAGE ---------- */
exports.uploadMedia = async (req, res) => {
  try {
    const { chatId, content, attachments } = req.body;

    if (!chatId || !attachments || attachments.length === 0) {
      return res
        .status(400)
        .json({ message: "Chat ID and attachments required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Set message type based on attachment type
    let messageType = "text";
    if (attachments.length > 0) {
      const firstAttachment = attachments[0];
      if (firstAttachment.type === "image") messageType = "image";
      else if (firstAttachment.type === "video") messageType = "video";
      else if (firstAttachment.type === "audio") messageType = "audio";
      else messageType = "file";
    }

    const message = await Message.create({
      sender: req.userId,
      chat: chatId,
      content: content || `Shared ${attachments.length} file(s)`,
      messageType,
      attachments,
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
    console.error("Upload media error:", error);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

/* ---------- GET MEDIA FROM CHAT ---------- */
exports.getChatMedia = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.includes(req.userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    console.error("Get chat media error:", error);
    res.status(500).json({ message: "Failed to fetch media" });
  }
};

/* ---------- DELETE MEDIA ---------- */
exports.deleteMedia = async (req, res) => {
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

    res.json({ message: "Media deleted", messageId });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({ message: "Failed to delete media" });
  }
};

/* ---------- VALIDATE BASE64 IMAGE SIZE ---------- */
exports.validateImageSize = async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.status(400).json({ message: "Image data required" });
    }

    // Rough estimate: base64 is ~33% larger than binary
    const sizeInBytes = Buffer.byteLength(base64, "utf8") * 0.75;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (sizeInBytes > maxSize) {
      return res.status(400).json({
        message: "Image too large (max 5MB)",
        size: (sizeInBytes / 1024 / 1024).toFixed(2),
      });
    }

    res.json({ valid: true, size: sizeInBytes });
  } catch (error) {
    console.error("Validate image error:", error);
    res.status(500).json({ message: "Failed to validate image" });
  }
};
