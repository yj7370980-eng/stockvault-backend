require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const authRoutes = require('./routes/authRoutes'); // REMOVED
// const profileRoutes = require('./routes/profileRoutes'); // REMOVE if you want no profile API
const inventoryRoutes = require('./routes/inventoryRoutes');
const reportingRoutes = require('./routes/reportingRoutes');
const supportRoutes = require('./routes/supportRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productsRoutes = require('./routes/productsRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Allowed origins: include your real Vercel domain + any other frontends you use
const allowedOrigins = [
  'https://stockvault-frontend.vercel.app', // <-- your current Vercel domain
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} from origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Register feature routes ONLY (login/auth/profile removed)
// app.use('/api/auth', authRoutes); // REMOVED
// app.use('/api/profile', profileRoutes); // REMOVE if you want no profile API

app.use('/api/products', productsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/support', supportRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API');
});

function logErrors(err, req, res, next) {
  console.error('ERROR STACK:', err.stack || err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: err.stack ? err.stack.split('\n') : []
  });
}

app.use(logErrors);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
