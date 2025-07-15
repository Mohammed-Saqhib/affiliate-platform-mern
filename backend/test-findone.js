const User = require('./models/User');

async function testFindOne() {
    try {
        console.log('Testing findOne...');
        
        // Test different ways to find the user
        const user1 = await User.findOne({ email: 'admin@example.com' });
        console.log('findOne with email:', user1 ? 'Found' : 'Not found');
        
        const all = await User.findAll();
        console.log('Total users:', all.length);
        console.log('First user email:', all[0]?.email);
        
        // Try exact match
        const exactMatch = all.find(u => u.email === 'admin@example.com');
        console.log('Exact email match:', exactMatch ? 'Found' : 'Not found');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testFindOne();
