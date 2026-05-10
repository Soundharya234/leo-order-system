const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  itemsTotal: { type: Number, default: 0 },
  previousBalance: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["Cash", "GPay"], default: "Cash" },
  paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Paid" },
  remainingBalance: { type: Number, default: 0 },
  deliveryMethod: { type: String, default: "Store Pickup" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  orderNumber: { type: String, unique: true },
  dateTime: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
