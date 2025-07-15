# Render Deployment Configuration

## 📋 **Deployment Strategy**
We'll deploy your app as a **Web Service** on Render, which will:
1. Build the React frontend 
2. Serve both frontend and backend from the same service
3. Include your JSON database files

## 🔧 **Build Configuration**
- **Build Command:** `npm run build:render`
- **Start Command:** `npm start`
- **Environment:** Node.js
- **Instance Type:** Free tier (perfect for testing)

## 📁 **File Structure Ready**
Your project structure is already perfect for Render:
```
affiliate-platform-mern/
├── frontend/          # React frontend
├── backend/           # Express backend + JSON database
├── package.json       # Root package.json (main deployment)
└── render.yaml        # Render configuration (we'll create this)
```

## 🌍 **Environment Variables for Render**
Set these in Render dashboard:
- `JWT_SECRET`: your_super_secret_jwt_key_for_affiliate_platform_2025
- `NODE_ENV`: production
- `PORT`: 10000 (Render's default)

## 🔗 **Domain**
Your app will be available at: `https://your-app-name.onrender.com`
