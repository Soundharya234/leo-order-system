const express = require("express");
const router = express.Router();
const { addInwardLoad, getInwardLoads } = require("../controllers/procurementController");
const { protect } = require("../middleware/authMiddleware");

router.post("/load", protect, addInwardLoad);
router.get("/loads", protect, getInwardLoads);

module.exports = router;
