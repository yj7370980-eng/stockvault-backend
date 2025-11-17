const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/reporting/summary?startDate=YYYY-MM&endDate=YYYY-MM
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};

    // Filter by month/year (strings like "2025-11") using 'createdAt'
    if (startDate) match.createdAt = { $gte: new Date(startDate + '-01') };
    if (endDate) {
      const [year, month] = endDate.split('-').map(Number);
      const afterEnd = new Date(year, month, 1);
      match.createdAt = { ...match.createdAt, $lt: afterEnd };
    }

    // Pull all orders matching filter
    const orders = await Order.find(match).lean();

    // Aggregation containers
    const revenueByMonth = {};
    const profitByMonth = {};
    const customerPurchase = {};
    const productSales = {};
    const salesChannel = {};

    orders.forEach(order => {
      // Aggregate by correct fields
      const month = order.createdAt ? order.createdAt.toISOString().slice(0, 7) : '';
      revenueByMonth[month] = (revenueByMonth[month] || 0) + (order.totalPrice || 0);
      profitByMonth[month] = (profitByMonth[month] || 0) + ((order.totalPrice || 0) * 0.3);
      customerPurchase[order.customer] = (customerPurchase[order.customer] || 0) + 1;
      (order.orderItems || []).forEach(({ name, qty }) => {
        productSales[name] = (productSales[name] || 0) + qty;
      });
      const channel = order.channel || 'Others';
      salesChannel[channel] = (salesChannel[channel] || 0) + 1;
    });

    res.json({
      revenueData: Object.entries(revenueByMonth).map(([date, revenue]) => ({ date, revenue })),
      profitData: Object.entries(profitByMonth).map(([date, profit]) => ({ date, profit })),
      customerPurchaseCount: Object.entries(customerPurchase).map(([customer, count]) => ({ customer, count })),
      productSales: Object.entries(productSales).map(([name, sold]) => ({ name, sold })),
      salesChannels: Object.entries(salesChannel).map(([channel, count]) => ({ channel, count })),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
