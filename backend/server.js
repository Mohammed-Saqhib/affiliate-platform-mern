require('dotenv').config(); // Load environment variables at the very beginning
const express = require('express');
const cors = require('cors'); // Required for frontend to communicate with backend
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://affiliate-platform-mern.onrender.com'] 
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(express.json({ limit: '50mb' })); // Body parser for JSON data with increased limit
app.use(cors(corsOptions)); // Enable CORS with specific options

// Trust proxy for production
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Initialize JSON Database
console.log('Using JSON file-based database...');
console.log('Database files will be stored in: ./data/ directory');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message 
    });
});

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
try {
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/products', require('./routes/productRoutes'));
    app.use('/api/affiliate', require('./routes/affiliateRoutes'));
} catch (error) {
    console.error('Error loading routes:', error);
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});

// Serve static files from React build (for production)
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../frontend/build');
    
    // Check if build directory exists
    if (fs.existsSync(buildPath)) {
        console.log('Serving static files from:', buildPath);
        app.use(express.static(buildPath, {
            maxAge: '1d',
            etag: false
        }));
        
        // Handle React routing - send all non-API requests to React app
        app.get('/*', (req, res) => {
            try {
                res.sendFile(path.join(buildPath, 'index.html'));
            } catch (error) {
                console.error('Error serving index.html:', error);
                res.status(500).json({ message: 'Error serving application' });
            }
        });
    } else {
        console.error('Build directory not found:', buildPath);
        app.get('/*', (req, res) => {
            res.status(503).json({ 
                message: 'Application build not found',
                path: buildPath
            });
        });
    }
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

// Server startup with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    if (process.env.NODE_ENV === 'production') {
        console.log(`🌐 Application: https://affiliate-platform-mern.onrender.com`);
    }
});

server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
