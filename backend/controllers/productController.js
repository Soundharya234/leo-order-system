const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public (or Private based on requirement)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
  try {
    // Products where stock is less than 50 (or a custom threshold if added to model)
    const products = await Product.find({ stock: { $lt: 50 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const product = new Product({ name, price, stock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getLowStockProducts,
  addProduct,
};
