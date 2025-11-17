const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// No need to import middleware logic here unless protecting routes inside auth

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
