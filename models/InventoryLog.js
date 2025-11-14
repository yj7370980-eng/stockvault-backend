const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityChange: { type: Number, required: true }, // positive or negative
  action: { type: String, enum: ['add', 'remove', 'adjust'], required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);

module.exports = InventoryLog;
