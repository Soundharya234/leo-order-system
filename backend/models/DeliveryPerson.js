const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vehicleNo: { type: String },
  status: { type: String, enum: ["Available", "Out for Delivery", "Unavailable"], default: "Available" },
  totalDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  balance: { type: Number, default: 0 } // Any pending commission or cash-on-hand
}, { timestamps: true });

module.exports = mongoose.model("DeliveryPerson", deliveryPersonSchema);
