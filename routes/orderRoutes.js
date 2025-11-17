// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch(e) {
    res.status(400).json({ message: e.message });
  }
});

// Read/List Orders with filtering & pagination
router.get('/', async (req, res) => {
  try {
    const {
      search, category, startDate, endDate, page = 1, limit = 10
    } = req.query;

    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { customer: regex },
        { channel: regex },
        { _id: regex }
      ];
    }
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

    const totalCount = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: -1 }); // newest first

    res.json({ totalCount, orders });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update Order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Batch Status Update
router.post('/batch-update-status', async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || !status) return res.status(400).json({ message: 'Missing ids or status' });
  try {
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    res.json({ modifiedCount: result.modifiedCount });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Further endpoints can be added like delete, get analytics data, etc.

module.exports = router;
