const Product = require('../models/Product');

// GET /api/products?search=&category=&sortKey=&sortDirection=&page=&limit=
const getProducts = async (req, res) => {
  try {
    let { search = '', category, sortKey = 'name', sortDirection = 'asc', page = 0, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const sortOptions = {};
    sortOptions[sortKey] = sortDirection === 'asc' ? 1 : -1;

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(page * limit)
      .limit(limit)
      .exec();

    res.json({ products, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, sku, price, description, category, quantity, store } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const product = new Product({
      name,
      sku,
      price,
      description,
      category,
      quantity,
      store,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.name === 'MongoError' && error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
      return res.status(400).json({ message: 'SKU must be unique. This SKU is already in use.' });
    }
    
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// POST /api/products/bulk-delete
const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body; // array of product _id values
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Deleted ${ids.length} products` });
  } catch (error) {
    res.status(500).json({ message: 'Server error bulk deleting products' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
};
