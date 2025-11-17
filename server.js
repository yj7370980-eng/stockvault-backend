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

// Allowed origins: include your real Vercel domain + any other frontends you use
const allowedOrigins = [
  'https://stockvault-frontend-gzxshsv9d-yashs-projects-e2af8b99.vercel.app', // <-- your current Vercel domain
];

// CORS setup with restricted origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies / credentials if you use them
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With']
}));

// Allow preflight for all routes
app.options('*', cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for easier debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} from origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Register routes
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/support', supportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Inventory Management API');
});

// Error logging middleware (debug only) - logs stack and returns JSON
// Remove or tighten this before long-term production use
function logErrors(err, req, res, next) {
  console.error('ERROR STACK:', err.stack || err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    // returning stack helps debugging on Render; remove in production
    stack: err.stack ? err.stack.split('\n') : []
  });
}

app.use(logErrors);
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
