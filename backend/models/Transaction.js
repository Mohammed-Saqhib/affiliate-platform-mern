const { transactionsDB } = require('../config/jsonDatabase');

class Transaction {
  static create(transactionData) {
    // Validate required fields
    if (!transactionData.affiliateLinkId || !transactionData.productId || !transactionData.affiliateId || !transactionData.amount) {
      throw new Error('Affiliate Link ID, Product ID, Affiliate ID, and amount are required');
    }

    // Create transaction object
    const transaction = {
      affiliateLinkId: transactionData.affiliateLinkId,
      productId: transactionData.productId,
      affiliateId: transactionData.affiliateId,
      amount: parseFloat(transactionData.amount),
      commissionEarned: parseFloat(transactionData.commissionEarned) || 0,
      status: transactionData.status || 'pending',
      purchasedAt: transactionData.purchasedAt || new Date().toISOString()
    };

    return transactionsDB.create(transaction);
  }

  static findOne(criteria) {
    return transactionsDB.findOne(criteria);
  }

  static findByPk(id) {
    return transactionsDB.findById(id);
  }

  static findAll(criteria = {}) {
    return transactionsDB.findAll(criteria);
  }

  static updateByPk(id, updateData) {
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }
    if (updateData.commissionEarned) {
      updateData.commissionEarned = parseFloat(updateData.commissionEarned);
    }
    return transactionsDB.updateById(id, updateData);
  }

  static deleteByPk(id) {
    return transactionsDB.deleteById(id);
  }

  static count(criteria = {}) {
    return transactionsDB.count(criteria);
  }

  static findByAffiliate(affiliateId) {
    return transactionsDB.findAll({ affiliateId });
  }

  static findByProduct(productId) {
    return transactionsDB.findAll({ productId });
  }

  static findByStatus(status) {
    return transactionsDB.findAll({ status });
  }

  static getTotalCommissionEarned(affiliateId) {
    const transactions = this.findByAffiliate(affiliateId);
    return transactions.reduce((total, transaction) => total + transaction.commissionEarned, 0);
  }

  static getTotalSales(affiliateId) {
    const transactions = this.findByAffiliate(affiliateId);
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }
}

module.exports = Transaction;
