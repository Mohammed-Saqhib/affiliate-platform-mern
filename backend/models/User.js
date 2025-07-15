const { usersDB } = require('../config/jsonDatabase');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = usersDB.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = usersDB.findOne({ username: userData.username });
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user object
    const user = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      isActive: userData.isActive !== undefined ? userData.isActive : true
    };

    return usersDB.create(user);
  }

  static findOne(criteria) {
    return usersDB.findOne(criteria);
  }

  static findByPk(id) {
    return usersDB.findById(id);
  }

  static findAll(criteria = {}) {
    return usersDB.findAll(criteria);
  }

  static async updateByPk(id, updateData) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    return usersDB.updateById(id, updateData);
  }

  static deleteByPk(id) {
    return usersDB.deleteById(id);
  }

  static async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password);
  }

  static count(criteria = {}) {
    return usersDB.count(criteria);
  }
}

module.exports = User;
