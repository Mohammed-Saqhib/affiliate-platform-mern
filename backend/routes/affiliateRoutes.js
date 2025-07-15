const express = require('express');
const { User, Product, AffiliateLink, Transaction } = require('../models');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Generate a new affiliate link for a product
// @route   POST /api/affiliate/generate-link
// @access  Private (User/Affiliate)
router.post('/generate-link', protect, authorizeRoles('user'), async (req, res) => {
    const { productId, commissionRate } = req.body;
    const affiliateId = req.user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingLink = await AffiliateLink.findOne({ 
            where: { 
                productId: productId, 
                affiliateId: affiliateId 
            }
        });
        
        if (existingLink) {
            return res.status(200).json({ 
                message: 'Affiliate link already exists for this product and user', 
                link: existingLink 
            });
        }

        const affiliateLink = await AffiliateLink.create({
            productId: productId,
            affiliateId: affiliateId,
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
        const affiliateLinks = await AffiliateLink.findAll({
            where: { affiliateId: req.user.id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name', 'price']
                }
            ]
        });
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
        const affiliateLink = await AffiliateLink.findOne({ 
            where: { shortCode: req.params.shortCode }
        });

        if (!affiliateLink) {
            return res.status(404).json({ message: 'Affiliate link not found' });
        }

        // Increment click count
        await affiliateLink.update({ clicks: affiliateLink.clicks + 1 });

        const product = await Product.findByPk(affiliateLink.productId);
        if (product) {
            // For a college project, you can simply redirect to the product's image URL
            res.redirect(product.imageUrl || '/');
        } else {
            res.status(404).json({ message: 'Associated product not found' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Simulate a purchase via an affiliate link
// @route   POST /api/affiliate/purchase
// @access  Private/Admin (for simulation purposes)
router.post('/purchase', protect, authorizeRoles('admin'), async (req, res) => {
    const { shortCode } = req.body;

    try {
        const affiliateLink = await AffiliateLink.findOne({
            where: { shortCode },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!affiliateLink) {
            return res.status(404).json({ message: 'Affiliate link not found' });
        }

        // Increment purchase count
        await affiliateLink.update({ purchases: affiliateLink.purchases + 1 });

        const product = affiliateLink.product;
        const commissionEarned = product.price * affiliateLink.commissionRate;

        // Record the transaction
        const transaction = await Transaction.create({
            affiliateLinkId: affiliateLink.id,
            productId: product.id,
            affiliateId: affiliateLink.affiliateId,
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
        const transactions = await Transaction.findAll({
            include: [
                {
                    model: AffiliateLink,
                    as: 'affiliateLink',
                    attributes: ['shortCode']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'affiliate',
                    attributes: ['username']
                }
            ]
        });
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
        const transactions = await Transaction.findAll({
            where: { affiliateId: req.user.id },
            include: [
                {
                    model: AffiliateLink,
                    as: 'affiliateLink',
                    attributes: ['shortCode']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                }
            ]
        });
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
        const transaction = await Transaction.findByPk(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status === 'paid') {
            return res.status(400).json({ message: 'Transaction already paid' });
        }

        await transaction.update({ status: 'paid' });

        res.json({ message: 'Payment disbursed successfully!', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
