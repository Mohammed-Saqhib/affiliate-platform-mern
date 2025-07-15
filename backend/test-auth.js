const User = require('./models/User');

async function testAuth() {
    try {
        console.log('Testing authentication...');
        
        // Find admin user
        const user = await User.findOne({ email: 'admin@example.com' });
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if (user) {
            console.log('User ID:', user.id);
            console.log('User email:', user.email);
            console.log('Password hash exists:', !!user.password);
            
            // Test password comparison
            const isMatch = await User.comparePassword(user, 'admin123');
            console.log('Password matches:', isMatch);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAuth();
