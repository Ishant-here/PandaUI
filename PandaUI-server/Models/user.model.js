const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    aiCredits: {
      type: Number,
      default: 150,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    totalCreditsPurchased: {
      type: Number,
      default: 0,
    },
    lastPaymentId: {
      type: String,
      default: null,
    },
    lastPaymentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);