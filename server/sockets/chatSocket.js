const Message = require("../models/Message");
const Chat = require("../models/Chat");

module.exports = (io, socket) => {
  /* ---------- JOIN CHAT ROOM ---------- */
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  /* ---------- TYPING INDICATOR ---------- */
  socket.on("typing", ({ chatId, userId, username }) => {
    if (!chatId) return;

    socket.to(chatId).emit("typing", {
      userId,
      username,
    });
  });

  socket.on("stop_typing", ({ chatId, userId }) => {
    if (!chatId) return;

    socket.to(chatId).emit("stop_typing", {
      userId,
    });
  });

  /* ---------- SEND MESSAGE ---------- */
  socket.on("send_message", async ({ chatId, content }) => {
    try {
      if (!chatId || !content) return;

      const chat = await Chat.findById(chatId);
      if (!chat || !chat.members.includes(socket.userId)) return;

      const message = await Message.create({
        sender: socket.userId,
        chat: chatId,
        content,
        readBy: [socket.userId],
      });

      io.to(chatId).emit("receive_message", {
        _id: message._id,
        sender: socket.userId,
        chat: chatId,
        content: message.content,
        readBy: message.readBy,
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error("Socket send_message error:", error);
    }
  });

  /* ---------- READ RECEIPTS ---------- */
  socket.on("message_read", async ({ chatId, messageIds }) => {
    try {
      if (!chatId || !Array.isArray(messageIds)) return;

      await Message.updateMany(
        {
          _id: { $in: messageIds },
          readBy: { $ne: socket.userId },
        },
        { $addToSet: { readBy: socket.userId } }
      );

      socket.to(chatId).emit("message_read", {
        chatId,
        messageIds,
        userId: socket.userId,
      });
    } catch (error) {
      console.error("Socket message_read error:", error);
    }
  });

  // * ---------- Delete ---------- */
  socket.on("delete_message", ({ messageId, chatId }) => {
  socket.to(chatId).emit("message_deleted", { messageId });
});

};
