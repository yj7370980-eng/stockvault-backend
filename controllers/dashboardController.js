const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const stockAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$quantity" } } }
    ]);
    const totalStock = stockAgg[0]?.totalStock || 0;

    const salesAgg = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ]);
    const totalSales = salesAgg[0]?.totalSales || 0;

    res.json({ totalProducts, totalOrders, totalCustomers, totalStock, totalSales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const threshold = 5;
    const products = await Product.find({ quantity: { $lt: threshold } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock' });
  }
};

exports.getOutOfStock = async (req, res) => {
  try {
    const products = await Product.find({ quantity: 0 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching out of stock products' });
  }
};

exports.getOrderStatusOverview = async (req, res) => {
  try {
    const statuses = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order status overview' });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
};

exports.getSalesSummary = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales summary' });
  }
};

exports.getStockRatio = async (req, res) => {
  try {
    const ratios = await Product.aggregate([
      { $group: { _id: "$category", totalQuantity: { $sum: "$quantity" } } }
    ]);
    res.json(ratios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock ratio' });
  }
};

exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product categories' });
  }
};

exports.getTopStores = async (req, res) => {
  try {
    // Example assuming Order model has a store field
    const topStores = await Order.aggregate([
      {
        $group: {
          _id: "$store",
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);
    res.json(topStores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top stores' });
  }
};

exports.getExpenseProfitRatio = async (req, res) => {
  try {
    // Customize based on your expense & profit schema
    const expenseProfit = { expense: 10000, profit: 5000 };
    res.json(expenseProfit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense profit ratio' });
  }
};
