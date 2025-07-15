const { connectDB } = require('./config/database');
const { User, Product, AffiliateLink, Transaction } = require('./models');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDB();

        // Clear existing data (only for development)
        await Transaction.destroy({ where: {} });
        await AffiliateLink.destroy({ where: {} });
        await Product.destroy({ where: {} });
        await User.destroy({ where: {} });

        console.log('🗑️  Cleared existing data');

        // Create users
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@demo.com',
            password: 'admin123',
            role: 'admin'
        });

        const user1 = await User.create({
            username: 'johndoe',
            email: 'user@demo.com',
            password: 'user123',
            role: 'user'
        });

        const user2 = await User.create({
            username: 'janesmith',
            email: 'jane@demo.com',
            password: 'jane123',
            role: 'user'
        });

        console.log('👥 Created users');

        // Create products
        const products = await Product.bulkCreate([
            {
                name: 'Wireless Bluetooth Headphones',
                description: 'High-quality wireless headphones with noise cancellation and 20-hour battery life.',
                price: 99.99,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
            },
            {
                name: 'Smart Fitness Watch',
                description: 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.',
                price: 199.99,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'
            },
            {
                name: 'Portable Laptop Stand',
                description: 'Ergonomic adjustable laptop stand for better posture and productivity.',
                price: 49.99,
                imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'
            },
            {
                name: 'USB-C Charging Hub',
                description: 'Multi-port USB-C hub with fast charging and data transfer capabilities.',
                price: 79.99,
                imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
            },
            {
                name: 'Mechanical Gaming Keyboard',
                description: 'RGB backlit mechanical keyboard with customizable keys and gaming modes.',
                price: 129.99,
                imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop'
            },
            {
                name: 'Wireless Mouse',
                description: 'Precision wireless mouse with ergonomic design and long battery life.',
                price: 39.99,
                imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop'
            }
        ]);

        console.log('📦 Created products');

        // Create some affiliate links
        const affiliateLink1 = await AffiliateLink.create({
            productId: products[0].id,
            affiliateId: user1.id,
            commissionRate: 0.10,
            clicks: 5,
            purchases: 1
        });

        const affiliateLink2 = await AffiliateLink.create({
            productId: products[1].id,
            affiliateId: user1.id,
            commissionRate: 0.15,
            clicks: 12,
            purchases: 2
        });

        const affiliateLink3 = await AffiliateLink.create({
            productId: products[2].id,
            affiliateId: user2.id,
            commissionRate: 0.10,
            clicks: 8,
            purchases: 1
        });

        console.log('🔗 Created affiliate links');

        // Create some transactions
        await Transaction.bulkCreate([
            {
                affiliateLinkId: affiliateLink1.id,
                productId: products[0].id,
                affiliateId: user1.id,
                amount: products[0].price,
                commissionEarned: products[0].price * 0.10,
                status: 'pending'
            },
            {
                affiliateLinkId: affiliateLink2.id,
                productId: products[1].id,
                affiliateId: user1.id,
                amount: products[1].price,
                commissionEarned: products[1].price * 0.15,
                status: 'paid'
            },
            {
                affiliateLinkId: affiliateLink2.id,
                productId: products[1].id,
                affiliateId: user1.id,
                amount: products[1].price,
                commissionEarned: products[1].price * 0.15,
                status: 'pending'
            },
            {
                affiliateLinkId: affiliateLink3.id,
                productId: products[2].id,
                affiliateId: user2.id,
                amount: products[2].price,
                commissionEarned: products[2].price * 0.10,
                status: 'pending'
            }
        ]);

        console.log('💰 Created transactions');

        console.log('🎉 Database seeding completed successfully!');
        console.log('');
        console.log('📋 Demo accounts created:');
        console.log('   Admin: admin@demo.com / admin123');
        console.log('   User 1: user@demo.com / user123');
        console.log('   User 2: jane@demo.com / jane123');
        console.log('');
        console.log('📊 Sample data:');
        console.log(`   Products: ${products.length}`);
        console.log(`   Affiliate Links: 3`);
        console.log(`   Transactions: 4`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit(0);
    }
};

seedData();
