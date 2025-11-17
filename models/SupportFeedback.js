// models/SupportFeedback.js
const mongoose = require('mongoose');

const supportFeedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportFeedback', supportFeedbackSchema);
