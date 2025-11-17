const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Expense = require('../models/Expense');

// Get overall stats like total products, orders, stock, out of stock
exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalStockAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$quantity" } } }
    ]);
    const totalStock = totalStockAgg[0]?.totalStock || 0;

    const outOfStock = await Product.countDocuments({ quantity: 0 });

    const totalCustomers = await Order.distinct('customer').then(ids => ids.length);

    res.json({ totalProducts, totalOrders, totalStock, outOfStock, totalCustomers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Order status distribution
exports.getOrderStatus = async (req, res) => {
  try {
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const colorMapping = { Pending: '#f4a261', Shipped: '#2a9d8f', Delivered: '#264653' };
    const result = statusAgg.map(s => ({ status: s._id, count: s.count, color: colorMapping[s._id] || '#888' }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Low stock products (quantity under 5)
exports.getLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ quantity: { $lt: 5 } })
      .select('name quantity')
      .lean();
    const data = lowStockProducts.map(p => ({ name: p.name, remaining: p.quantity }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Recent orders sample
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id orderItems status createdAt')
      .lean();

    // For each order, show top level order ID and first product details
    const data = recentOrders.map(o => {
      const firstItem = o.orderItems[0] || {};
      return {
        orderId: o._id.toString(),
        product: firstItem.name || "",
        quantity: firstItem.qty || 0,
        status: o.status,
        date: o.createdAt.toISOString().split('T')[0]
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Sales summary aggregation by month (example static values)
exports.getSalesSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Aggregate current month sales
    const salesCurrentMonthAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfCurrentMonth, $lt: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const salesAmount = salesCurrentMonthAgg[0]?.total || 0;

    // Aggregate last month sales
    const salesLastMonthAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const lastMonthAmount = salesLastMonthAgg[0]?.total || 0;

    // Change percent calculation
    const changePercent = lastMonthAmount
      ? (((salesAmount - lastMonthAmount) / lastMonthAmount) * 100).toFixed(2)
      : "0.00";

    res.json({ salesAmount, changePercent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Stock ratio sold units vs total units
exports.getStockRatio = async (req, res) => {
  try {
    const totalUnitsAgg = await Product.aggregate([
      { $group: { _id: null, totalUnits: { $sum: "$quantity" } } }
    ]);
    const soldUnits = 32;  // Replace with real sold units calc
    const totalUnits = totalUnitsAgg[0]?.totalUnits || 0;
    res.json([
      { name: 'Sold units', value: soldUnits },
      { name: 'Total units', value: totalUnits },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Product categories count
exports.getCategories = async (req, res) => {
  try {
    const categoriesAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json(categoriesAgg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top stores by sales
exports.getTopStores = async (req, res) => {
   try {
    // Aggregate total sales per channel from the Order collection
const salesAgg = await Order.aggregate([
  { $group: { _id: "$store", sales: { $sum: "$totalPrice" } } },
  { $sort: { sales: -1 } },
  { $limit: 10 }
]);


    const storesWithNames = await Store.populate(salesAgg, { path: "_id", select: "name" });

    const data = storesWithNames.map(s => ({
      store: s._id ? s._id.name : "Unknown Store",
      sales: s.sales
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Expense vs profit data over months (example static data)
exports.getExpenseProfit = async (req, res) => {
  try {
    const data = [
      { month: "Dec", expense: 20, profit: 26 },
      { month: "Jan", expense: 22, profit: 27 },
      { month: "Feb", expense: 24, profit: 29 },
      { month: "Mar", expense: 25, profit: 31 },
      { month: "Apr", expense: 26, profit: 36 },
      { month: "May", expense: 31, profit: 40 },
      { month: "Jun", expense: 32, profit: 42 },
    ];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
