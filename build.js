const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Affiliate Platform build process...');

// Set environment
process.env.NODE_ENV = 'production';
process.env.CI = 'true';

try {
    // Backend dependencies
    console.log('📦 Installing backend dependencies...');
    process.chdir(path.join(__dirname, 'backend'));
    execSync('npm install --production --no-optional --no-audit --no-fund', { stdio: 'inherit' });
    
    // Frontend dependencies and build
    console.log('🎨 Installing frontend dependencies...');
    process.chdir(path.join(__dirname, 'frontend'));
    execSync('npm install --no-optional --no-audit --no-fund', { stdio: 'inherit' });
    
    console.log('🏗️ Building React frontend...');
    execSync('npm run build:prod', { stdio: 'inherit' });
    
    // Verify build
    const buildPath = path.join(__dirname, 'frontend', 'build');
    if (fs.existsSync(buildPath)) {
        console.log('✅ Build completed successfully!');
        console.log('📁 Frontend build output: frontend/build/');
        console.log('🌐 Ready for deployment!');
    } else {
        throw new Error('Build directory not found');
    }
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
