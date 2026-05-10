const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");
const { protect, admin } = require("../middleware/authMiddleware");

// @route GET /api/suppliers
router.get("/", protect, async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/suppliers
router.post("/", protect, admin, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
