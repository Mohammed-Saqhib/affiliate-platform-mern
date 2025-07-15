#!/bin/bash

# Render-specific build script with enhanced error handling
echo "🚀 Starting Render build process..."

# Set environment variables
export NODE_ENV=production
export CI=true
export GENERATE_SOURCEMAP=false

# Backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install --production --no-optional --no-audit --no-fund
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi

# Return to root
cd ..

# Frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd frontend && npm install --no-optional --no-audit --no-fund
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

# Frontend build with direct Node.js execution
echo "🏗️ Building React frontend..."
npx cross-env CI=true node ./node_modules/react-scripts/bin/react-scripts.js build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Verify build output
cd ..
if [ -d "frontend/build" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Frontend build output: frontend/build/"
    ls -la frontend/build/
else
    echo "❌ Build directory not found"
    exit 1
fi

echo "🌐 Ready for deployment!"
