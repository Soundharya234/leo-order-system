const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  getCustomerProfile,
  getCustomerPurchases,
  getAvailableStock,
  processPayment,
  addReview,
} = require("../controllers/customerPortalController");

const { protectCustomer } = require("../middleware/customerAuth");

// Public routes
router.post("/login", loginCustomer);

// Protected routes
router.get("/profile", protectCustomer, getCustomerProfile);
router.get("/purchases", protectCustomer, getCustomerPurchases);
router.get("/stock", protectCustomer, getAvailableStock);
router.post("/payment", protectCustomer, processPayment);
router.post("/review/:id", protectCustomer, addReview);


module.exports = router;
