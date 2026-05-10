const express = require("express");
const router = express.Router();
const { getProducts, getLowStockProducts, addProduct } = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes
router.route("/")
  .get(getProducts)
  .post(protect, admin, addProduct);

router.get("/low-stock", protect, admin, getLowStockProducts);

module.exports = router;
