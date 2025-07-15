# Affiliate Platform - Render Deployment

## 🚀 Deployment Type: Web Service

This will deploy as a single web service that serves both the React frontend and Express backend.

## 📁 Project Structure
```
├── frontend/          # React app
├── backend/           # Express API
├── package.json       # Root package.json (for Render)
└── render.yaml        # Render configuration (optional)
```

## 🔧 Build Process
1. Install dependencies
2. Build React frontend 
3. Start Express server (serves both API and static files)

## 🌐 Environment Variables Needed
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: production

## 📊 Database
- JSON file-based storage (no external database required)
- Data persists in the `/data` directory
