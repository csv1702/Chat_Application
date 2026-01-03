const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessagesByChat,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, getMessagesByChat);

module.exports = router;
