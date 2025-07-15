# 🚀 Affiliate Platform - MERN Stack College Project

A comprehensive affiliate marketing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that demonstrates full-stack development capabilities including user authentication, affiliate link generation, click tracking, and simulated payment disbursement.

## 📋 Features

### Core Functionality
- 🔐 **User Authentication & Authorization** - JWT-based auth with role management
- 🛍️ **Product Management** - Admin CRUD operations for products
- 🔗 **Affiliate Link Generation** - Unique short links for each product
- 📊 **Click & Conversion Tracking** - Real-time analytics and metrics
- 💰 **Commission Calculation** - Automatic commission calculation on purchases
- 💳 **Payment Simulation** - Simulated payment disbursement system
- 📱 **Responsive Design** - Modern, mobile-friendly UI

### User Roles
- **Admin**: Manage products, view all transactions, simulate purchases, disburse payments
- **Affiliate**: Generate links, track performance, view earnings and transactions

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **shortid** - Unique link generation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Modern CSS** - Responsive styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd affiliate-platform-mern
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create `.env` file in backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/affiliate_db
   JWT_SECRET=your_super_secret_jwt_key_for_affiliate_platform_2025
   PORT=5000
   ```

4. **Seed Demo Data**
   ```bash
   node seed.js
   ```

5. **Start Backend Server**
   ```bash
   node server.js
   ```

6. **Frontend Setup** (New terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend Server**
   ```bash
   npm start
   ```

8. **Access the Application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

After running the seed script, you can use these demo accounts:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`

**Affiliate Account:**
- Email: `user@demo.com`
- Password: `user123`

## 📖 API Documentation

### Authentication Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (Protected)

### Product Routes
- `GET /api/products` - Get all products (Public)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Affiliate Routes
- `POST /api/affiliate/generate-link` - Generate affiliate link (User)
- `GET /api/affiliate/my-links` - Get user's affiliate links (User)
- `GET /api/affiliate/track/:shortCode` - Track click and redirect (Public)
- `POST /api/affiliate/purchase` - Simulate purchase (Admin)
- `GET /api/affiliate/transactions` - Get all transactions (Admin)
- `GET /api/affiliate/my-transactions` - Get user transactions (User)
- `PUT /api/affiliate/transactions/:id/pay` - Mark transaction as paid (Admin)

## 🎯 How to Use

### For Affiliates
1. **Register/Login** as an affiliate user
2. **Browse Products** on the homepage
3. **Generate Links** from your dashboard
4. **Share Links** to earn commissions
5. **Track Performance** and view earnings

### For Admins
1. **Login** with admin credentials
2. **Manage Products** (Add, Edit, Delete)
3. **Monitor Transactions** and affiliate performance
4. **Simulate Purchases** for testing
5. **Disburse Payments** to affiliates

## 🧪 Testing the Platform

1. **Create Affiliate Links**
   - Login as affiliate user
   - Generate links for products
   - Copy the generated affiliate links

2. **Test Click Tracking**
   - Open affiliate link in new browser tab
   - Verify click count increases in dashboard

3. **Simulate Purchases**
   - Login as admin
   - Use "Simulate Purchase" button
   - Check transaction appears in both admin and affiliate dashboards

4. **Test Payment Flow**
   - Admin marks transactions as "Paid"
   - Affiliate sees updated payment status

## 📁 Project Structure

```
affiliate-platform-mern/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── AffiliateLink.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── affiliateRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── Footer.js
    │   │   └── PrivateRoute.js
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── ProductListScreen.js
    │   │   ├── AffiliateDashboardScreen.js
    │   │   └── AdminDashboardScreen.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node seed.js` - Seed database with demo data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎓 Educational Value

This project demonstrates:

1. **Full-Stack Development** - Complete MERN stack implementation
2. **Authentication & Authorization** - JWT tokens, role-based access
3. **Database Design** - MongoDB schemas and relationships
4. **RESTful API Design** - Proper HTTP methods and status codes
5. **React Best Practices** - Component structure, state management
6. **Security Considerations** - Password hashing, protected routes
7. **Business Logic** - Affiliate marketing workflow simulation

## 🚀 Deployment Ready

The project is structured for easy deployment:

- **Backend**: Ready for Heroku, Vercel, or DigitalOcean
- **Frontend**: Ready for Netlify, Vercel, or GitHub Pages
- **Database**: Compatible with MongoDB Atlas

## 📝 Future Enhancements

- Email notifications for new commissions
- Advanced analytics and reporting
- Real payment integration (Stripe, PayPal)
- Social media sharing features
- Mobile app development
- Advanced affiliate tiers and bonuses



## 📄 License

This project is for educational purposes only.

---

**Built with ❤️ for learning full-stack development**
