const express = require('express');
const router = express.Router();
const { addInventory, removeInventory, getInventoryLogs } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addInventory);
router.post('/remove', protect, removeInventory);
router.get('/logs', protect, getInventoryLogs);

module.exports = router;
