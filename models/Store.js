// models/Store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  contactNumber: String,
  email: { type: String, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Store', storeSchema);
