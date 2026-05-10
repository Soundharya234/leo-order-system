const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash" },
  paymentStatus: { type: String, enum: ["Paid", "Credit", "Partial"], default: "Paid" },
  
  // Delivery Tracking
  deliveryType: { type: String, enum: ["Store Pickup", "Door Delivery"], default: "Store Pickup" },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPerson", default: null },
  deliveryStatus: { type: String, enum: ["Not Applicable", "Pending", "Out for Delivery", "Delivered"], default: "Not Applicable" },
  deliveryAddress: { type: String },
  deliveryCharge: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
