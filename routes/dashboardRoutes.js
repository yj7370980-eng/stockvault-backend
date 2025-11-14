const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, dashboardController.getStats);
router.get('/low-stock', protect, dashboardController.getLowStock);
router.get('/out-of-stock', protect, dashboardController.getOutOfStock);
router.get('/order-status', protect, dashboardController.getOrderStatusOverview);
router.get('/recent-orders', protect, dashboardController.getRecentOrders);
router.get('/sales-summary', protect, dashboardController.getSalesSummary);
router.get('/stock-ratio', protect, dashboardController.getStockRatio);
router.get('/categories', protect, dashboardController.getProductCategories);
router.get('/top-stores', protect, dashboardController.getTopStores);
router.get('/expense-profit', protect, dashboardController.getExpenseProfitRatio);

module.exports = router;
