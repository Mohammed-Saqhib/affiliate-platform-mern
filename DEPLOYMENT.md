# Affiliate Platform - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Push to GitHub
Ensure all changes are committed and pushed to your GitHub repository.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `affiliate-platform-mern` repository

### 3. Configure Environment Variables
In Vercel dashboard, add these environment variables:
```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 4. Deploy
Vercel will automatically build and deploy your application!

## 📁 Project Structure
```
├── frontend/          # React frontend (builds to static files)
├── backend/           # Express backend
│   ├── api/index.js   # Vercel serverless entry point
│   ├── data/          # JSON database files
│   └── models/        # JSON-based models
└── vercel.json        # Vercel configuration
```

## 🗄️ Database
- **Type:** JSON file-based storage
- **Location:** `backend/data/` folder
- **Files:** users.json, products.json, affiliateLinks.json, transactions.json
- **Persistence:** Files are included in deployment bundle

## 🔧 Environment Configuration
- **Development:** Uses `http://localhost:5000/api`
- **Production:** Uses relative `/api` paths (handled by Vercel routing)

## 📝 Test Credentials
After deployment, register new users or use the seeding script to create test data.

## 🐛 Troubleshooting
If you get build errors:
1. Ensure all dependencies are in `package.json`
2. Check that `frontend/build` folder is created successfully
3. Verify environment variables are set in Vercel dashboard
