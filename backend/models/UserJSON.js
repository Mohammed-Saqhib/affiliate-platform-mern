const bcrypt = require('bcryptjs');
const db = require('../data/database');

class User {
    static async create(userData) {
        // Hash password before saving
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }
        return await db.create('users', userData);
    }

    static async findAll() {
        return await db.findAll('users');
    }

    static async findById(id) {
        return await db.findById('users', id);
    }

    static async findOne(condition) {
        return await db.findOne('users', condition);
    }

    static async updateById(id, updateData) {
        return await db.updateById('users', id, updateData);
    }

    static async deleteById(id) {
        return await db.deleteById('users', id);
    }

    static async deleteMany(condition) {
        return await db.deleteMany('users', condition);
    }

    // Instance method to compare password
    static async matchPassword(user, enteredPassword) {
        return await bcrypt.compare(enteredPassword, user.password);
    }
}

module.exports = User;
