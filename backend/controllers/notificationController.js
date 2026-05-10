const Notification = require("../models/Notification");

// @desc    Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort("-createdAt").limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
const markRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.status = "read";
      await notification.save();
      res.json({ message: "Notification marked as read" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotifications, markRead };
