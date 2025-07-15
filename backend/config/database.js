const { Sequelize } = require('sequelize');
const path = require('path');

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Database file will be stored in project root
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true, // Adds createdAt and updatedAt fields
    underscored: false, // Use camelCase instead of snake_case
  }
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database connected successfully!');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ force: false }); // Set force: true to recreate tables
    console.log('✅ Database tables synchronized!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
