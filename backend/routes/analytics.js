const express = require("express");
const router = express.Router();
const { getAnalyticsSummary, getSalesTrends, getDailySales, getDashboardSummary } = require("../controllers/analyticsController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/summary", protect, admin, getAnalyticsSummary);
router.get("/dashboard-summary", protect, admin, getDashboardSummary);
router.get("/trends", protect, admin, getSalesTrends);
router.get("/daily-sales", protect, admin, getDailySales);

module.exports = router;
