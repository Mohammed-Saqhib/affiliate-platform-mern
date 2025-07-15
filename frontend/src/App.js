import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductListScreen from './screens/ProductListScreen';
import AffiliateDashboardScreen from './screens/AffiliateDashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    // Attempt to get user info from localStorage
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const stored = localStorage.getItem('userInfo');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error("Failed to parse userInfo from localStorage", error);
            return null;
        }
    });

    // Function to update user info, passed to login/register screens
    const handleLogin = (newUserInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
        setUserInfo(newUserInfo);
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    return (
        <Router>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header userInfo={userInfo} onLogout={handleLogout} />
                <main style={{ flex: 1, padding: '20px 0' }}>
                    <div className="container">
                        <Routes>
                            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegisterScreen onLogin={handleLogin} />} />
                            <Route path="/" element={<ProductListScreen />} />

                            {/* Private Routes for Users/Affiliates */}
                            <Route 
                                path="/affiliate-dashboard" 
                                element={
                                    <PrivateRoute roles={['user', 'admin']} userInfo={userInfo}>
                                        <AffiliateDashboardScreen />
                                    </PrivateRoute>
                                } 
                            />

                            {/* Private Routes for Admin */}
                            <Route 
                                path="/admin-dashboard" 
                                element={
                                    <PrivateRoute roles={['admin']} userInfo={userInfo}>
                                        <AdminDashboardScreen />
                                    </PrivateRoute>
                                } 
                            />
                        </Routes>
                    </div>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
