const express = require('express');
const Product = require('../models/Product');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    try {
        const product = await Product.create({
            name,
            description,
            price,
            imageUrl,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.update({
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
                imageUrl: imageUrl || product.imageUrl,
            });
            
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.destroy();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
