require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/affiliate_db';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect to database
connectDB();

// Basic Route for testing
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Affiliate Platform API is running on Vercel!',
        timestamp: new Date().toISOString(),
        routes: [
            'GET /api - This endpoint',
            'POST /api/users/register - User registration',
            'POST /api/users/login - User login',
            'GET /api/products - Get all products',
            'POST /api/affiliate/generate - Generate affiliate link'
        ]
    });
});

// Routes
try {
    app.use('/api/users', require('../backend/routes/userRoutes'));
    app.use('/api/products', require('../backend/routes/productRoutes'));
    app.use('/api/affiliate', require('../backend/routes/affiliateRoutes'));
} catch (error) {
    console.error('Error loading routes:', error);
}

// Handle root requests
app.get('/', (req, res) => {
    res.json({ message: 'Affiliate Platform API - Use /api for API endpoints' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
});

module.exports = app;
