require('dotenv').config(); // Load environment variables at the very beginning
const express = require('express');
const cors = require('cors'); // Required for frontend to communicate with backend

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all origins (for development)

// Initialize JSON Database
console.log('Using JSON file-based database...');
console.log('Database files will be stored in: ./data/ directory');

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Affiliate Platform API is running!',
        database: 'JSON File-based Database',
        status: 'Connected',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/affiliate', require('./routes/affiliateRoutes'));

// Export the app for Vercel
module.exports = app;

// Start the server only in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Database directory: ./data/`);
    });
}
