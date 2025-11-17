require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reportingRoutes = require('./routes/reportingRoutes');
const supportRoutes = require('./routes/supportRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productsRoutes = require('./routes/productsRoutes');

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = ['stockvault-frontend-pp9tehcb5-yashs-projects-e2af8b99.vercel.app'];

app.use(cors());

app.use(express.json());

// Routes with protection where needed
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/support', supportRoutes);
app.get('/', (req, res) => {
  res.send('Inventory Management API');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
