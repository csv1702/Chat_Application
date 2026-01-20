const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadMedia,
  getChatMedia,
  deleteMedia,
} = require("../controllers/uploadController");

/* Upload media to chat */
router.post("/media", authMiddleware, uploadMedia);

/* Get all media from a chat */
router.get("/media/:chatId", authMiddleware, getChatMedia);

/* Delete media message */
router.delete("/media/:messageId", authMiddleware, deleteMedia);

module.exports = router;
