const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserProfile,
  getOwnProfile,
  updateProfile,
  updateAvatar,
  searchUsers,
} = require("../controllers/userController");

/* Get user profile by ID (public) */
router.get("/profile/:userId", getUserProfile);

/* Get own profile (protected) */
router.get("/profile", authMiddleware, getOwnProfile);

/* Update own profile (protected) */
router.put("/profile", authMiddleware, updateProfile);

/* Update avatar (protected) */
router.put("/avatar", authMiddleware, updateAvatar);

/* Search users by username (protected) */
router.get("/search", authMiddleware, searchUsers);

module.exports = router;
