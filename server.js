require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Add this import
const { protect } = require('./middleware/authMiddleware');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// Auth routes (register, login)
app.use('/api/auth', authRoutes);

// Profile routes protected by JWT auth middleware
app.use('/api/profile', protect, profileRoutes); // Add this line

app.use('/api/dashboard', protect, dashboardRoutes);

app.use('/api/inventory', protect, inventoryRoutes);

app.use('/api/orders', protect, orderRoutes);

// Protect product routes with JWT auth middleware
app.use('/api/products', protect, productRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Inventory Management API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
