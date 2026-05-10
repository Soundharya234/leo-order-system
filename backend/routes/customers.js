const express = require("express");
const router = express.Router();
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAnalytics,
} = require("../controllers/customerController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes
router.route("/")
  .get(protect, admin, getCustomers)
  .post(protect, admin, addCustomer);

router.get("/analytics", protect, admin, getCustomerAnalytics);

router.route("/:id")
  .put(protect, admin, updateCustomer)
  .delete(protect, admin, deleteCustomer);

// @route PUT /api/customers/:id/payment
router.put("/:id/payment", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const { amountPaid } = req.body;
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    
    customer.balance = Math.max(0, customer.balance - amountPaid);
    await customer.save();
    res.json({ message: "Payment updated", newBalance: customer.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/customers/:id/visit
router.put("/:id/visit", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    
    customer.visitCount = (customer.visitCount || 0) + 1;
    await customer.save();
    res.json({ message: "Visit recorded", visitCount: customer.visitCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
