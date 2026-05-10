const InwardLoad = require("../models/InwardLoad");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

// @desc    Log a new inward load (Procurement)
// @route   POST /api/procurement/load
const addInwardLoad = async (req, res) => {
  const { supplierId, riceType, quantity, rate, transportCharge, amountPaid } = req.body;
  
  try {
    const totalBill = (quantity * rate) + (transportCharge || 0);
    const amountDue = totalBill - (amountPaid || 0);

    const load = await InwardLoad.create({
      supplier: supplierId,
      riceType,
      quantityInKg: quantity,
      ratePerKg: rate,
      transportCharge,
      totalBill,
      amountPaid,
      amountDue
    });

    // Update Supplier totalOwed
    const supplier = await Supplier.findById(supplierId);
    if (supplier) {
      supplier.totalOwed += amountDue;
      await supplier.save();
    }

    // Update Product Stock
    const product = await Product.findOne({ name: riceType });
    if (product) {
      product.stock += Number(quantity);
      await product.save();
    }

    res.status(201).json(load);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inward loads
const getInwardLoads = async (req, res) => {
  try {
    const loads = await InwardLoad.find({}).populate("supplier").sort("-createdAt");
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addInwardLoad, getInwardLoads };
