const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  userAgents: { type: String, default: null },
  socketId: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  has_logged_in: { type: Boolean, default: false },
  notifications: [
    {
      type: {
        type: String,
        required: true,
        default: "info",
      },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
