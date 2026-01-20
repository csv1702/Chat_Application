const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    groupName: {
      type: String,
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ---------- DATABASE INDEXES FOR PERFORMANCE ---------- */
chatSchema.index({ members: 1 });
chatSchema.index({ isGroup: 1 });
chatSchema.index({ updatedAt: -1 });
chatSchema.index({ admin: 1 });

module.exports = mongoose.model("Chat", chatSchema);
