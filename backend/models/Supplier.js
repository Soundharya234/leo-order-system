const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mandiName: { type: String }, // Mill or Mandi Name
  location: { type: String, default: "Karnataka" }, // e.g., Karnataka, Mannachanallur, Local Mandi
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  distanceInKm: { type: Number, default: 0 },
  distanceRatePerKm: { type: Number, default: 10 }, // Transport cost per KM
  totalOwed: { type: Number, default: 0 }, // Amount shop owner owes to this supplier
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);
