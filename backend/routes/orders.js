const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

// @route POST /api/orders
// @desc Create new order and update customer balance
router.post("/", protect, async (req, res) => {
  console.log("INCOMING ORDER REQUEST:", JSON.stringify(req.body, null, 2));
  try {
    const { 
      customerName, items, itemsTotal, 
      previousBalance, finalAmount, paymentMethod, 
      paymentStatus, remainingBalance, deliveryMethod,
      address, phone
    } = req.body;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    const order = new Order({
      customerId: req.user?._id || req.body.customerId,
      customerName: customerName || req.user?.name,
      items, 
      itemsTotal: Number(itemsTotal) || 0,
      previousBalance: Number(previousBalance) || 0,
      finalAmount: Number(finalAmount) || 0,
      paymentMethod,
      paymentStatus, 
      remainingBalance: Number(remainingBalance) || 0,
      deliveryMethod,
      address, 
      phone,
      orderNumber
    });

    const createdOrder = await order.save();
    console.log("Order Saved Successfully:", createdOrder._id);

    // Create Notification for Admin
    const Notification = require("../models/Notification");
    await Notification.create({
      title: "New Customer Order",
      message: `New order ${orderNumber} placed by ${order.customerName} for ₹${order.finalAmount}`,
      type: "order",
      priority: "high",
      relatedId: createdOrder._id
    });

    // Update customer balance & visitCount in User model
    const customer = await User.findById(order.customerId);
    if (customer) {
      customer.balance = order.remainingBalance;
      customer.visitCount = (customer.visitCount || 0) + 1;
      await customer.save();
      console.log(`Customer balance updated to: ${order.remainingBalance}, visits: ${customer.visitCount}`);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders/all
// @desc Get all orders (Admin only)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders/:customerId
// @desc Get order history for a specific customer
router.get("/:customerId", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
