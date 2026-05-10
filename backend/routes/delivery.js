const express = require("express");
const router = express.Router();
const { addDeliveryPerson, getDeliveryPersonnel, updateDeliveryStatus } = require("../controllers/deliveryController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addDeliveryPerson);
router.get("/", protect, getDeliveryPersonnel);
router.put("/status", protect, updateDeliveryStatus);

module.exports = router;
