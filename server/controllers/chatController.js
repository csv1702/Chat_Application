const Chat = require("../models/Chat");

/* ---------------- CREATE CHAT ---------------- */
exports.createChat = async (req, res) => {
  try {
    const { userId, isGroup, members, groupName } = req.body;

    // One-to-one chat
    if (!isGroup) {
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const existingChat = await Chat.findOne({
        isGroup: false,
        members: { $all: [req.userId, userId] },
      });

      if (existingChat) {
        return res.json(existingChat);
      }

      const chat = await Chat.create({
        isGroup: false,
        members: [req.userId, userId],
      });

      return res.status(201).json(chat);
    }

    // Group chat
    if (!members || members.length < 2 || !groupName) {
      return res
        .status(400)
        .json({ message: "Group requires name and members" });
    }

    const chat = await Chat.create({
      isGroup: true,
      members: [req.userId, ...members],
      groupName,
      admin: req.userId,
    });

    res.status(201).json(chat);
  } catch (error) {
  console.error("Create chat error:", error);
  res.status(500).json({ message: "Failed to create chat" });
}
};

/* ---------------- GET USER CHATS ---------------- */
exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: req.userId,
    })
      .populate("members", "username email avatar isOnline lastSeen")
      .populate("admin", "username email")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

/* ---------------- ACCESS OR CREATE 1-1 CHAT ---------------- */
exports.accessOneToOneChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [req.userId, userId] },
    }).populate("members", "username avatar isOnline");

    if (chat) {
      return res.json(chat);
    }

    const newChat = await Chat.create({
      isGroup: false,
      members: [req.userId, userId],
    });

    const populatedChat = await Chat.findById(newChat._id)
      .populate("members", "username avatar isOnline");

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error("Access chat error:", error);
    res.status(500).json({ message: "Failed to access chat" });
  }
};
