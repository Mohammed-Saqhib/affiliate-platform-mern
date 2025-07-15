const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    affiliateLink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AffiliateLink',
        required: true,
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
    amount: { // Price of the product at the time of purchase
        type: Number,
        required: true,
    },
    commissionEarned: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    purchasedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);
