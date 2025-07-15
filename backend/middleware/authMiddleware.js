const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fallback secret if not provided in environment
const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_platform_secret';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            // Fetch user from database to ensure still valid
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            // Attach user id and role
            req.user = { id: user.id, role: user.role };
            return next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            }
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
