const User = require('./models/User');
const Product = require('./models/Product');
const AffiliateLink = require('./models/AffiliateLink');
const Transaction = require('./models/Transaction');

async function seedDatabase() {
    try {
        console.log('🌱 Seeding JSON database...');

        // Create sample users
        console.log('Creating users...');
        const admin = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        const affiliate1 = await User.create({
            username: 'affiliate1',
            email: 'affiliate1@example.com',
            password: 'password123',
            role: 'user'
        });

        const affiliate2 = await User.create({
            username: 'affiliate2',
            email: 'affiliate2@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('✅ Users created successfully');

        // Create sample products
        console.log('Creating products...');
        const product1 = Product.create({
            name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 99.99,
            commission: 15.00,
            imageUrl: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Headphones',
            category: 'Electronics'
        });

        const product2 = Product.create({
            name: 'Smart Fitness Watch',
            description: 'Track your fitness goals with this advanced smartwatch',
            price: 199.99,
            commission: 25.00,
            imageUrl: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Smart+Watch',
            category: 'Fitness'
        });

        const product3 = Product.create({
            name: 'Portable Laptop Stand',
            description: 'Ergonomic laptop stand for better posture and productivity',
            price: 49.99,
            commission: 8.00,
            imageUrl: 'https://via.placeholder.com/300x300/ffc107/000000?text=Laptop+Stand',
            category: 'Accessories'
        });

        console.log('✅ Products created successfully');

        // Create affiliate links
        console.log('Creating affiliate links...');
        const link1 = AffiliateLink.create({
            productId: product1.id,
            affiliateId: affiliate1.id,
            commissionRate: 0.15,
            clicks: 45,
            purchases: 3
        });

        const link2 = AffiliateLink.create({
            productId: product2.id,
            affiliateId: affiliate1.id,
            commissionRate: 0.25,
            clicks: 32,
            purchases: 2
        });

        const link3 = AffiliateLink.create({
            productId: product3.id,
            affiliateId: affiliate2.id,
            commissionRate: 0.16,
            clicks: 28,
            purchases: 4
        });

        console.log('✅ Affiliate links created successfully');

        // Create sample transactions
        console.log('Creating transactions...');
        Transaction.create({
            affiliateLinkId: link1.id,
            productId: product1.id,
            affiliateId: affiliate1.id,
            amount: 99.99,
            commissionEarned: 15.00,
            status: 'paid',
            purchasedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        });

        Transaction.create({
            affiliateLinkId: link2.id,
            productId: product2.id,
            affiliateId: affiliate1.id,
            amount: 199.99,
            commissionEarned: 50.00,
            status: 'pending',
            purchasedAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
        });

        Transaction.create({
            affiliateLinkId: link3.id,
            productId: product3.id,
            affiliateId: affiliate2.id,
            amount: 49.99,
            commissionEarned: 8.00,
            status: 'paid',
            purchasedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        });

        console.log('✅ Transactions created successfully');

        console.log('🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`• Users: 3`);
        console.log(`• Products: 3`);
        console.log(`• Affiliate Links: 3`);
        console.log(`• Transactions: 3`);

        console.log('\n🔐 Login Credentials:');
        console.log('Admin: admin@example.com / admin123');
        console.log('Affiliate 1: affiliate1@example.com / password123');
        console.log('Affiliate 2: affiliate2@example.com / password123');

        console.log('\n📁 JSON files stored in: ./data/');

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
}

// Run the seeding
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
