const express = require("express");
const router = express.Router();
const axios = require("axios");
const { protect } = require("../middleware/authMiddleware");

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5001/api";

// @route POST /api/ml/predict-demand
router.post("/predict-demand", protect, async (req, res) => {
  try {
    // Forward the request to Python API
    const response = await axios.post(`${ML_API_URL}/predict/demand`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error communicating with ML Service" });
  }
});

// @route POST /api/ml/recommend
router.post("/recommend", protect, async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/recommend`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error communicating with ML Service" });
  }
});

module.exports = router;
