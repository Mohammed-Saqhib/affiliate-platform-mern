const db = require('../data/database');
const shortid = require('shortid');

class AffiliateLink {
    static async create(linkData) {
        // Auto-generate short code if not provided
        if (!linkData.shortCode) {
            linkData.shortCode = shortid.generate();
        }
        // Set default values
        linkData.clicks = linkData.clicks || 0;
        linkData.purchases = linkData.purchases || 0;
        linkData.commissionRate = linkData.commissionRate || 0.10;
        
        return await db.create('affiliateLinks', linkData);
    }

    static async findAll() {
        return await db.findAll('affiliateLinks');
    }

    static async findById(id) {
        return await db.findById('affiliateLinks', id);
    }

    static async findOne(condition) {
        return await db.findOne('affiliateLinks', condition);
    }

    static async find(condition) {
        return await db.find('affiliateLinks', condition);
    }

    static async updateById(id, updateData) {
        return await db.updateById('affiliateLinks', id, updateData);
    }

    static async deleteById(id) {
        return await db.deleteById('affiliateLinks', id);
    }

    static async deleteMany(condition) {
        return await db.deleteMany('affiliateLinks', condition);
    }
}

module.exports = AffiliateLink;
