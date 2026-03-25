import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import enquiryRoutes from './routes/enquiries.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import quoteRoutes from './routes/quotes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [])
];

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
  })
);
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shree-guhan-steels')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quotes', quoteRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
