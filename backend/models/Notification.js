const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["low_stock", "procurement", "delivery", "order", "system"], default: "system" },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Product ID, Transaction ID, etc.
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
