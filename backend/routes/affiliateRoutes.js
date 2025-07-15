const express = require('express');
const AffiliateLink = require('../models/AffiliateLink');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Generate a new affiliate link for a product
// @route   POST /api/affiliate/generate-link
// @access  Private (User/Affiliate)
router.post('/generate-link', protect, authorizeRoles('user'), async (req, res) => {
    const { productId, commissionRate } = req.body;
    const affiliateId = req.user._id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingLink = await AffiliateLink.findOne({ product: productId, affiliate: affiliateId });
        if (existingLink) {
            return res.status(200).json({ message: 'Affiliate link already exists for this product and user', link: existingLink });
        }

        const affiliateLink = await AffiliateLink.create({
            product: productId,
            affiliate: affiliateId,
            commissionRate: commissionRate || 0.10, // Default to 10% if not provided
        });

        res.status(201).json(affiliateLink);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all affiliate links for the authenticated user
// @route   GET /api/affiliate/my-links
// @access  Private (User/Affiliate)
router.get('/my-links', protect, authorizeRoles('user'), async (req, res) => {
    try {
        const affiliateLinks = await AffiliateLink.find({ affiliate: req.user._id }).populate('product', 'name price');
        res.json(affiliateLinks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Redirect to product page and record click
// @route   GET /api/affiliate/track/:shortCode
// @access  Public
router.get('/track/:shortCode', async (req, res) => {
    try {
        const affiliateLink = await AffiliateLink.findOne({ shortCode: req.params.shortCode });

        if (!affiliateLink) {
            return res.status(404).json({ message: 'Affiliate link not found' }); // Or redirect to a generic product page/error
        }

        // Increment click count (you might want to debouncing for real world)
        affiliateLink.clicks += 1;
        await affiliateLink.save();

        const product = await Product.findById(affiliateLink.product);
        if (product) {
            // For a college project, you can simply redirect to the product's image URL
            // In a real app, this would redirect to the actual product page on your (or a vendor's) e-commerce site.
            res.redirect(product.imageUrl || '/'); // Redirect to product image or homepage
        } else {
            res.status(404).json({ message: 'Associated product not found' });
        }

        // IMPORTANT: Store the shortCode in a cookie or session to track potential purchase
        // For simplicity in a college project, we'll simulate this on the backend
        // by making a separate API call for 'purchase'
        // In a real scenario, the redirect would happen, and if the user purchases,
        // your e-commerce system would send a webhook or make an API call to record the conversion
        // using the stored shortCode/affiliate info.

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Simulate a purchase via an affiliate link
// @route   POST /api/affiliate/purchase
// @access  Private/Admin (for simulation purposes, in real world, this would be an internal call/webhook)
router.post('/purchase', protect, authorizeRoles('admin'), async (req, res) => {
    const { shortCode } = req.body;

    try {
        const affiliateLink = await AffiliateLink.findOne({ shortCode }).populate('product');

        if (!affiliateLink) {
            return res.status(404).json({ message: 'Affiliate link not found' });
        }

        // Increment purchase count
        affiliateLink.purchases += 1;
        await affiliateLink.save();

        const product = affiliateLink.product;
        const commissionEarned = product.price * affiliateLink.commissionRate;

        // Record the transaction
        const transaction = await Transaction.create({
            affiliateLink: affiliateLink._id,
            product: product._id,
            affiliate: affiliateLink.affiliate,
            amount: product.price,
            commissionEarned: commissionEarned,
            status: 'pending', // Default status
        });

        res.status(201).json({ message: 'Purchase recorded successfully!', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all transactions (for admin)
// @route   GET /api/affiliate/transactions
// @access  Private/Admin
router.get('/transactions', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('affiliateLink', 'shortCode')
            .populate('product', 'name')
            .populate('affiliate', 'username');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get transactions for authenticated affiliate
// @route   GET /api/affiliate/my-transactions
// @access  Private (User/Affiliate)
router.get('/my-transactions', protect, authorizeRoles('user'), async (req, res) => {
    try {
        const transactions = await Transaction.find({ affiliate: req.user._id })
            .populate('affiliateLink', 'shortCode')
            .populate('product', 'name');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark a transaction as paid (disburse payment)
// @route   PUT /api/affiliate/transactions/:id/pay
// @access  Private/Admin
router.put('/transactions/:id/pay', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status === 'paid') {
            return res.status(400).json({ message: 'Transaction already paid' });
        }

        transaction.status = 'paid';
        await transaction.save();

        res.json({ message: 'Payment disbursed successfully!', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
