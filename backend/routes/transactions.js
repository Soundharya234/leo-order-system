const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// @route GET /api/transactions
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({}).populate("cashier customer items.product");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/transactions
router.post("/", protect, async (req, res) => {
  const { 
    items, totalAmount, discount, finalAmount, paymentMethod, 
    customerId, deliveryType, deliveryBoyId, deliveryAddress, deliveryCharge, paymentStatus 
  } = req.body;

  try {
    const transaction = new Transaction({
      cashier: req.user._id,
      customer: customerId || null,
      items,
      totalAmount,
      discount,
      finalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || "Paid",
      deliveryType: deliveryType || "Store Pickup",
      deliveryBoy: deliveryBoyId || null,
      deliveryStatus: deliveryType === "Door Delivery" ? "Pending" : "Not Applicable",
      deliveryAddress,
      deliveryCharge: deliveryCharge || 0,
    });

    const createdTransaction = await transaction.save();

    // Auto-update inventory and Check for Low Stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        
        // Reorder Level Logic (Default to 20kg if not set)
        const reorderLevel = product.reorderLevel || 20;
        if (product.stock <= reorderLevel) {
          const Notification = require("../models/Notification");
          const Supplier = require("../models/Supplier");

          console.log(`[ALERT] Low Stock for ${product.name}! Stock: ${product.stock}. Notifying Suppliers...`);
          
          // Create Official Notification
          await Notification.create({
              title: "Low Stock Alert: " + product.name,
              message: `${product.name} is now at ${product.stock}kg. Restock required immediately.`,
              type: "low_stock",
              priority: "high",
              relatedId: product._id
          });

          // Simulated WhatsApp Trigger
          const mainSupplier = await Supplier.findOne({ isAvailable: true });
          if (mainSupplier) {
              console.log(`[WHATSAPP] MOCK SEND: To ${mainSupplier.name} (${mainSupplier.phone}) -> "Low Stock: ${product.name}. Requesting local restock."`);
          }
        }

        
        await product.save();
      }
    }

    // Update Delivery Boy count if assigned
    if (deliveryType === "Door Delivery" && deliveryBoyId) {
      const DeliveryPerson = require("../models/DeliveryPerson");
      await DeliveryPerson.findByIdAndUpdate(deliveryBoyId, { status: "Out for Delivery" });
    }

    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
