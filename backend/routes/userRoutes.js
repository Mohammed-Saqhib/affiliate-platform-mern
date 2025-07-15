// dotenv already loaded in server.js
// require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
// Use fallback secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'affiliate_platform_secret';
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user', // Default to 'user' if not specified
        });

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await User.comparePassword(user, password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.findAll();
        // Remove passwords from user list
        const usersResponse = users.map(u => {
            const { password, ...user } = u;
            return user;
        });
        res.json(usersResponse);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
