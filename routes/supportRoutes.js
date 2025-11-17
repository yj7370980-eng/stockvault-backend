const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const SupportFeedback = require('../models/SupportFeedback');

// POST /api/support/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const ticket = new SupportTicket({ name, email, message });
    await ticket.save();
    res.json({ message: 'Support ticket created' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST /api/support/feedback
router.post('/feedback', async (req, res) => {
  console.log('Feedback request:', req.body);
  try {
    const { rating } = req.body;
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    const feedback = new SupportFeedback({ rating });
    await feedback.save();
    res.json({ message: 'Feedback received' });
  } catch (e) {
    console.error('Error saving feedback:', e);
    res.status(500).json({ message: e.message });
  }
});


module.exports = router;
