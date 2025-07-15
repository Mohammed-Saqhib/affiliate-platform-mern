const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Affiliate Platform build process...');

// Set environment
process.env.NODE_ENV = 'production';
process.env.CI = 'true';
process.env.GENERATE_SOURCEMAP = 'false';

try {
    // Backend dependencies
    console.log('📦 Installing backend dependencies...');
    process.chdir(path.join(__dirname, 'backend'));
    execSync('npm install --production --no-optional --no-audit --no-fund', { stdio: 'inherit' });
    
    // Frontend dependencies
    console.log('🎨 Installing frontend dependencies...');
    process.chdir(path.join(__dirname, 'frontend'));
    execSync('npm install --no-optional --no-audit --no-fund', { stdio: 'inherit' });
    
    // Frontend build using direct Node.js execution
    console.log('🏗️ Building React frontend with direct Node.js execution...');
    
    // Try multiple approaches for maximum compatibility
    const buildCommands = [
        'npx cross-env CI=true node ./node_modules/react-scripts/bin/react-scripts.js build',
        'node ./node_modules/react-scripts/bin/react-scripts.js build',
        'npx react-scripts build'
    ];
    
    let buildSuccess = false;
    for (const command of buildCommands) {
        try {
            console.log(`Trying: ${command}`);
            execSync(command, { stdio: 'inherit' });
            buildSuccess = true;
            break;
        } catch (error) {
            console.log(`Command failed: ${command}`);
        }
    }
    
    if (!buildSuccess) {
        throw new Error('All build commands failed');
    }
    
    // Verify build
    process.chdir(__dirname);
    const buildPath = path.join(__dirname, 'frontend', 'build');
    if (fs.existsSync(buildPath)) {
        console.log('✅ Build completed successfully!');
        console.log('📁 Frontend build output: frontend/build/');
        
        // List build contents
        const buildContents = fs.readdirSync(buildPath);
        console.log('📁 Build contents:', buildContents.join(', '));
        
        console.log('🌐 Ready for deployment!');
    } else {
        throw new Error('Build directory not found');
    }
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
