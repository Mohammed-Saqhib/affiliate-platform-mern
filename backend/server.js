require('dotenv').config(); // Load environment variables at the very beginning
const express = require('express');
const cors = require('cors'); // Required for frontend to communicate with backend
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all origins (for development)

// Initialize JSON Database
console.log('Using JSON file-based database...');
console.log('Database files will be stored in: ./data/ directory');

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Affiliate Platform API is running!',
        database: 'JSON File-based Database',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Routes (API routes must come before static files)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/affiliate', require('./routes/affiliateRoutes'));

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(buildPath));
    
    // Handle React routing - send all non-API requests to React app
    app.get('/*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    // Development route
    app.get('/', (req, res) => {
        res.json({
            message: 'Affiliate Platform API is running!',
            database: 'JSON File-based Database',
            status: 'Connected',
            timestamp: new Date().toISOString()
        });
    });
}

// Export the app for testing
module.exports = app;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database directory: ./data/`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
