const express = require("express");
const router = express.Router();

const {
  createChat,
  getUserChats,
  accessOneToOneChat,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getUserChats);
router.post("/access", authMiddleware, accessOneToOneChat);

module.exports = router;
