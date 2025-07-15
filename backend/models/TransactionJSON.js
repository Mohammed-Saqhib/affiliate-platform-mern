const db = require('../data/database');

class Transaction {
    static async create(transactionData) {
        // Set default values
        transactionData.status = transactionData.status || 'pending';
        transactionData.purchasedAt = transactionData.purchasedAt || new Date().toISOString();
        
        return await db.create('transactions', transactionData);
    }

    static async findAll() {
        return await db.findAll('transactions');
    }

    static async findById(id) {
        return await db.findById('transactions', id);
    }

    static async findOne(condition) {
        return await db.findOne('transactions', condition);
    }

    static async find(condition) {
        return await db.find('transactions', condition);
    }

    static async updateById(id, updateData) {
        return await db.updateById('transactions', id, updateData);
    }

    static async deleteById(id) {
        return await db.deleteById('transactions', id);
    }

    static async deleteMany(condition) {
        return await db.deleteMany('transactions', condition);
    }
}

module.exports = Transaction;
