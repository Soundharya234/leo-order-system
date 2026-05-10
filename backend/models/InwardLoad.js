const mongoose = require("mongoose");

const inwardLoadSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  riceType: { type: String, required: true }, // Name of the rice
  quantityInKg: { type: Number, required: true },
  ratePerKg: { type: Number, required: true },
  transportCharge: { type: Number, default: 0 },
  totalBill: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number, required: true },
  origin: { type: String, default: "Karnataka" }, // Karnataka, Mandi, etc.
  status: { type: String, enum: ["Ordered", "In Transit", "Received"], default: "Received" },
  receivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("InwardLoad", inwardLoadSchema);
