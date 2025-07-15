const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
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
            ...userResponse,
            token: generateToken(user.id),
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
            // Remove password from response
            const userResponse = { ...user };
            delete userResponse.password;
            
            res.json({
                ...userResponse,
                token: generateToken(user.id),
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
router.get('/profile', protect, (req, res) => {
    res.json(req.user); // req.user is populated by protect middleware
});

module.exports = router;
