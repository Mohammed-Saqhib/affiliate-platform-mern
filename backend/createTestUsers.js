const User = require('./models/User');

async function createTestUsers() {
    try {
        console.log('Creating fresh test users...');

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            email: 'admin@demo.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin user created:', admin.email);

        // Create regular user
        const user = await User.create({
            username: 'testuser',
            email: 'user@demo.com',
            password: 'user123',
            role: 'user'
        });
        console.log('✅ Test user created:', user.email);

        console.log('\n🔐 Login Credentials:');
        console.log('Admin: admin@demo.com / admin123');
        console.log('User: user@demo.com / user123');

    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('ℹ️  Users already exist. Try these credentials:');
            console.log('Admin: admin@demo.com / admin123');
            console.log('User: user@demo.com / user123');
            console.log('\nOr register a new account through the web interface.');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

createTestUsers();
