const Customer = require("../models/Customer");

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new customer
// @route   POST /api/customers
// @access  Private/Admin
const addCustomer = async (req, res) => {
  const { name, phone, address, totalPurchase, visitCount } = req.body;

  try {
    const customer = new Customer({
      name,
      phone,
      address,
      totalPurchase: totalPurchase || 0,
      visitCount: visitCount || 0,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Admin
const updateCustomer = async (req, res) => {
  const { name, phone, address, totalPurchase, visitCount } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.name = name || customer.name;
      customer.phone = phone || customer.phone;
      customer.address = address || customer.address;
      customer.totalPurchase = totalPurchase !== undefined ? totalPurchase : customer.totalPurchase;
      customer.visitCount = visitCount !== undefined ? visitCount : customer.visitCount;
      customer.balance = req.body.balance !== undefined ? req.body.balance : customer.balance;
      customer.creditDueDate = req.body.creditDueDate !== undefined ? req.body.creditDueDate : customer.creditDueDate;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await customer.deleteOne();
      res.json({ message: "Customer removed" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer analytics
// @route   GET /api/customers/analytics
// @access  Private/Admin
const getCustomerAnalytics = async (req, res) => {
  try {
    const frequentCustomers = await Customer.find({ visitCount: { $gt: 10 } });
    const highValueCustomers = await Customer.find({ totalPurchase: { $gt: 5000 } });

    res.json({
      frequentCustomers,
      highValueCustomers,
      totalCount: await Customer.countDocuments(),
      stats: {
          frequentCount: frequentCustomers.length,
          highValueCount: highValueCustomers.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAnalytics,
};
