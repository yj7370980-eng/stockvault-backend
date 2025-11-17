const express = require('express');
const router = express.Router();
const { addInventory, removeInventory, getInventoryLogs } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', addInventory);
router.post('/remove', removeInventory);
router.get('/logs', getInventoryLogs);

module.exports = router;
