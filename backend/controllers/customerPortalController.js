const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret123", {
    expiresIn: "30d",
  });
};

// @desc    Customer Login by Phone
// @route   POST /api/customer/login
// @access  Public
const loginCustomer = async (req, res) => {
  const { phone } = req.body;

  try {
    const customer = await Customer.findOne({ phone });

    if (customer) {
      res.json({
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        role: "customer", // Virtual role for frontend
        token: generateToken(customer._id),
      });
    } else {
      res.status(401).json({ message: "Phone number not registered" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer purchase history
// @route   GET /api/customer/purchases
// @access  Private
const getCustomerPurchases = async (req, res) => {
  try {
    const transactions = await Transaction.find({ customer: req.user._id })
      .populate("items.product")
      .sort("-createdAt");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available stock for customers
// @route   GET /api/customer/stock
// @access  Private
const getAvailableStock = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process customer payment simulation
// @route   POST /api/customer/payment
// @access  Private
const processPayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const customer = await Customer.findById(req.user._id);
    if (customer) {
      customer.balance = Math.max(0, customer.balance - amount);
      const updatedCustomer = await customer.save();
      res.json({ message: "Payment successful", balance: updatedCustomer.balance });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review to product
// @route   POST /api/customer/review/:id
// @access  Private
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        user: req.user.name,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginCustomer,
  getCustomerProfile,
  getCustomerPurchases,
  getAvailableStock,
  processPayment,
  addReview,
};

