const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  totalPurchase: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 }, // Unpaid credit (kadan)
  lastPurchase: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number }
    }
  ],
  lastPurchaseDate: { type: Date },
  creditDueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
