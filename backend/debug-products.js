const Product = require('./models/Product');

console.log('Testing Product model directly...');

// Test synchronous call
const products = Product.findAll();
console.log('Synchronous call - Products found:', products.length);
console.log('First product ID type:', typeof products[0]?.id);
console.log('First product has _id?:', '_id' in (products[0] || {}));
console.log('First product keys:', Object.keys(products[0] || {}));

// Create a mock Express response to test the route
const mockReq = {};
const mockRes = {
    json: (data) => {
        console.log('\n=== ROUTE RESPONSE ===');
        console.log('Response data type:', Array.isArray(data) ? 'array' : typeof data);
        console.log('Response length:', data.length);
        console.log('First item keys:', Object.keys(data[0] || {}));
        console.log('First item has _id?:', '_id' in (data[0] || {}));
        console.log('First item _id:', data[0]?._id);
        console.log('First item id:', data[0]?.id);
    },
    status: () => ({ json: () => {} })
};

// Simulate the exact route logic
try {
    const routeProducts = Product.findAll();
    mockRes.json(routeProducts);
} catch (error) {
    console.error('Route error:', error);
}
