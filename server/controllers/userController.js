const User = require("../models/User");

/* ---------------- GET USER PROFILE BY ID ---------------- */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username email avatar bio phone isOnline lastSeen createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ---------------- GET OWN PROFILE (currently logged in user) ---------------- */
exports.getOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get own profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ---------------- UPDATE PROFILE ---------------- */
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, phone } = req.body;

    // Validate input
    if (username && username.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Username must be at least 2 characters" });
    }

    const updateData = {};

    if (username) updateData.username = username.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (phone !== undefined) updateData.phone = phone.trim();

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ---------------- UPDATE AVATAR (URL) ---------------- */
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Avatar updated successfully", user });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

/* ---------------- SEARCH USERS BY USERNAME ---------------- */
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 1) {
      return res.status(400).json({ message: "Search query required" });
    }

    const users = await User.find(
      {
        username: { $regex: query, $options: "i" },
        _id: { $ne: req.userId }, // Exclude current user
      },
      "username avatar isOnline email"
    ).limit(10);

    res.json(users);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
};
