const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  quantity: { type: Number, default: 0 },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
});

module.exports = mongoose.model('Product', productSchema);
