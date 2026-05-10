const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Get All-time and Current Summary
const getAnalyticsSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    
    const totalRevenue = orders.reduce((acc, o) => acc + o.finalAmount, 0);
    const totalCustomers = await User.countDocuments({ role: "customer" });
    
    const pendingPayments = orders
      .filter(o => o.paymentStatus === "Pending")
      .reduce((acc, o) => acc + o.finalAmount, 0);

    const lowStockCount = await Product.countDocuments({ stock: { $lt: 20 } });

    res.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingPayments,
      lowStockCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sales Trends for Charts
const getSalesTrends = async (req, res) => {
  try {
    const dailySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$finalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 15 }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total" }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      dailySales: dailySales.map(d => ({ date: d._id, amount: d.amount, count: d.count })),
      topProducts: topProducts.map(p => ({ name: p._id, qty: p.quantity, revenue: p.revenue }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kept for backward compatibility but using Order model now
const getDailySales = async (req, res) => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, sales: { $sum: "$finalAmount" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats.map(s => ({ name: s._id, sales: s.sales })));
};

const getDashboardSummary = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7d = new Date();
    startOf7d.setDate(startOf7d.getDate() - 7);

    // 1. Total Revenue (Last 7 Days)
    const sevenDayOrders = await Order.find({ createdAt: { $gte: startOf7d } });
    const totalRevenue = sevenDayOrders.reduce((acc, o) => acc + o.finalAmount, 0);

    // 2. Outstanding Kadan (Balance)
    const users = await User.find({});
    const outstandingBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);

    // 3. Loyalty Base (Visits > 5)
    const loyalCustomers = await User.countDocuments({ visitCount: { $gt: 5 } });

    // 4. Daily Traffic (Orders Today)
    const dailyOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });

    res.json({
      totalRevenue,
      outstandingBalance,
      loyalCustomers,
      dailyOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalyticsSummary, getSalesTrends, getDailySales, getDashboardSummary };
