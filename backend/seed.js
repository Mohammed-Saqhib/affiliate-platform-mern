require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding!');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@demo.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create affiliate user
        const affiliateUser = await User.create({
            username: 'affiliate',
            email: 'user@demo.com',
            password: 'user123',
            role: 'user'
        });

        console.log('Created demo users:');
        console.log('Admin - email: admin@demo.com, password: admin123');
        console.log('Affiliate - email: user@demo.com, password: user123');

        // Create sample products
        const products = [
            {
                name: 'Wireless Bluetooth Headphones',
                description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
                price: 99.99,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop'
            },
            {
                name: 'Smart Fitness Watch',
                description: 'Advanced fitness tracking with heart rate monitor, GPS, and waterproof design.',
                price: 199.99,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=300&fit=crop'
            },
            {
                name: 'Portable Phone Charger',
                description: '10000mAh portable power bank with fast charging and LED display.',
                price: 29.99,
                imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=300&fit=crop'
            },
            {
                name: 'Wireless Gaming Mouse',
                description: 'Professional gaming mouse with RGB lighting and customizable buttons.',
                price: 79.99,
                imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=300&fit=crop'
            },
            {
                name: 'Smart Home Speaker',
                description: 'Voice-controlled smart speaker with premium sound quality and home automation.',
                price: 149.99,
                imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=300&fit=crop'
            },
            {
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.',
                price: 49.99,
                imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=300&fit=crop'
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} sample products`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
