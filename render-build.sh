#!/bin/bash

# Render Build Script for Affiliate Platform MERN
echo "🚀 Starting Affiliate Platform build process..."

# Set Node environment
export NODE_ENV=production
export CI=true

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install --production --no-optional --no-audit --no-fund
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi
cd ..

# Frontend setup
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install --no-optional --no-audit --no-fund
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

# Frontend build
echo "🏗️ Building React frontend..."
npm run build:ci
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo "✅ Build completed successfully!"
echo "📁 Frontend build output: frontend/build/"
echo "🌐 Ready for deployment!"
