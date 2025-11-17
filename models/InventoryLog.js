const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityChange: { type: Number, required: true },
  action: { type: String, enum: ['add', 'remove'], required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
