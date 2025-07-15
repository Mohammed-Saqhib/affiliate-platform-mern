const { affiliateLinksDB } = require('../config/jsonDatabase');
const shortid = require('shortid');

class AffiliateLink {
  static create(linkData) {
    // Validate required fields
    if (!linkData.productId || !linkData.affiliateId) {
      throw new Error('Product ID and Affiliate ID are required');
    }

    // Generate short code if not provided
    const shortCode = linkData.shortCode || shortid.generate();

    // Check if short code already exists
    const existingLink = affiliateLinksDB.findOne({ shortCode });
    if (existingLink) {
      throw new Error('Short code already exists');
    }

    // Create affiliate link object
    const affiliateLink = {
      shortCode,
      productId: linkData.productId,
      affiliateId: linkData.affiliateId,
      clicks: linkData.clicks || 0,
      purchases: linkData.purchases || 0,
      commissionRate: parseFloat(linkData.commissionRate) || 0.10,
      isActive: linkData.isActive !== undefined ? linkData.isActive : true
    };

    return affiliateLinksDB.create(affiliateLink);
  }

  static findOne(criteria) {
    return affiliateLinksDB.findOne(criteria);
  }

  static findByPk(id) {
    return affiliateLinksDB.findById(id);
  }

  static findAll(criteria = {}) {
    return affiliateLinksDB.findAll(criteria);
  }

  static updateByPk(id, updateData) {
    if (updateData.commissionRate) {
      updateData.commissionRate = parseFloat(updateData.commissionRate);
    }
    if (updateData.clicks) {
      updateData.clicks = parseInt(updateData.clicks);
    }
    if (updateData.purchases) {
      updateData.purchases = parseInt(updateData.purchases);
    }
    return affiliateLinksDB.updateById(id, updateData);
  }

  static deleteByPk(id) {
    return affiliateLinksDB.deleteById(id);
  }

  static count(criteria = {}) {
    return affiliateLinksDB.count(criteria);
  }

  static findByAffiliate(affiliateId) {
    return affiliateLinksDB.findAll({ affiliateId });
  }

  static findByProduct(productId) {
    return affiliateLinksDB.findAll({ productId });
  }

  static incrementClicks(id) {
    const link = affiliateLinksDB.findById(id);
    if (link) {
      return this.updateByPk(id, { clicks: link.clicks + 1 });
    }
    return null;
  }

  static incrementPurchases(id) {
    const link = affiliateLinksDB.findById(id);
    if (link) {
      return this.updateByPk(id, { purchases: link.purchases + 1 });
    }
    return null;
  }
}

module.exports = AffiliateLink;
