const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/order-status', dashboardController.getOrderStatus);
router.get('/low-stock', dashboardController.getLowStock);
router.get('/recent-orders', dashboardController.getRecentOrders);
router.get('/sales-summary', dashboardController.getSalesSummary);
router.get('/stock-ratio', dashboardController.getStockRatio);
router.get('/categories', dashboardController.getCategories);
router.get('/top-stores', dashboardController.getTopStores);
router.get('/expense-profit', dashboardController.getExpenseProfit);

module.exports = router;
