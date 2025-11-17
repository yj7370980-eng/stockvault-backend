const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/bulk-delete', bulkDeleteProducts);

module.exports = router;
