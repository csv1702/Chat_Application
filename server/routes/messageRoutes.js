const express = require("express");
const router = express.Router();

/* Middleware */
const authMiddleware = require("../middleware/authMiddleware");

/* Controllers */
const {
  sendMessage,
  getMessagesByChat,
  deleteMessage,
  clearChatMessages,
} = require("../controllers/messageController");

/* Routes */

/* Send a message */
router.post("/", authMiddleware, sendMessage);

/* Get messages by chat */
router.get("/:chatId", authMiddleware, getMessagesByChat);

/* Delete single message */
router.delete("/:messageId", authMiddleware, deleteMessage);

/* Clear entire chat history */
router.delete("/chat/:chatId", authMiddleware, clearChatMessages);

module.exports = router;
