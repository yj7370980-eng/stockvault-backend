const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');

const addInventory = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity += quantity;
    await product.save();

    const log = new InventoryLog({
      product: product._id,
      quantityChange: quantity,
      action: 'add',
      note,
    });
    await log.save();

    res.json({ message: 'Inventory updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeInventory = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock to remove' });
    }

    product.quantity -= quantity;
    await product.save();

    const log = new InventoryLog({
      product: product._id,
      quantityChange: -quantity,
      action: 'remove',
      note,
    });
    await log.save();

    res.json({ message: 'Inventory updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getInventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.find().populate('product');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addInventory, removeInventory, getInventoryLogs };
