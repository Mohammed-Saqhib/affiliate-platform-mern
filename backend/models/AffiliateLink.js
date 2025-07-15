const mongoose = require('mongoose');
const shortid = require('shortid');

const affiliateLinkSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate, // Auto-generate short code
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    purchases: {
        type: Number,
        default: 0,
    },
    commissionRate: { // You can make this dynamic per product or per affiliate
        type: Number,
        default: 0.10, // 10% commission
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('AffiliateLink', affiliateLinkSchema);
