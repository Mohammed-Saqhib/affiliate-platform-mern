# Vercel Deployment Guide for Affiliate Platform

## Issues Fixed

The 404 NOT_FOUND error was occurring due to incorrect Vercel configuration. Here's what was fixed:

### 1. **Project Structure Updated**
- Created `/api/index.js` as the serverless function entry point
- Updated `vercel.json` with proper routing configuration
- Added root-level `package.json` for Vercel build process

### 2. **Fixed Configuration Files**

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/$1"
    }
  ],
  "outputDirectory": "frontend/build"
}
```

## Deployment Steps

### Step 1: Environment Variables
In your Vercel dashboard, add these environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/affiliate_db
JWT_SECRET=your_super_secret_jwt_key_for_affiliate_platform_2025
NODE_ENV=production
```

**Important:** Replace the MONGO_URI with your actual MongoDB Atlas connection string.

### Step 2: MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `mongodb://localhost:27017/affiliate_db` with your Atlas URI

### Step 3: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set the following build settings:
   - **Framework Preset:** Other
   - **Build Command:** `cd frontend && npm run build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `npm install`

### Step 4: Verify Deployment
After deployment, test these endpoints:
- `https://your-app.vercel.app/` - Frontend React app
- `https://your-app.vercel.app/api` - API health check
- `https://your-app.vercel.app/api/users/register` - User registration

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Solution:** Ensure MongoDB Atlas is configured with correct IP whitelist (0.0.0.0/0 for development)

### Issue 2: API Routes Not Working
**Solution:** Check that all API calls in frontend use relative URLs (`/api/...`) in production

### Issue 3: Build Failures
**Solution:** Ensure all dependencies are listed in package.json files

## File Structure After Fix
```
affiliate-platform-mern/
├── api/
│   └── index.js              # Serverless function entry point
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── build/               # Generated after build
│   └── package.json
├── package.json             # Root package.json
├── vercel.json             # Vercel configuration
└── vercelignore            # Files to ignore during deployment
```

## Testing Locally Before Deployment
1. Build frontend: `cd frontend && npm run build`
2. Test serverless function: `vercel dev`
3. Access at `http://localhost:3000`

## Next Steps
1. Update your MongoDB connection string in Vercel environment variables
2. Redeploy your application
3. Test all functionality

The 404 error should now be resolved!
