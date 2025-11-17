const Order = require('../models/Order');

const createOrder = async (req, res) => {
  console.log("Received order creation request payload:", JSON.stringify(req.body, null, 2));
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error saving order:", JSON.stringify(error, null, 2));
    res.status(400).json({ message: error.message, errors: error.errors || error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('orderItems.product');
    res.json({ totalCount: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
};
