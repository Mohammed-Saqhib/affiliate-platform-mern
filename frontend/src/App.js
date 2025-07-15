import React from 'react';
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
    return (
        <Router>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ flex: 1, padding: '20px 0' }}>
                    <div className="container">
                        <Routes>
                            <Route path="/login" element={<LoginScreen />} />
                            <Route path="/register" element={<RegisterScreen />} />
                            <Route path="/" element={<ProductListScreen />} />

                            {/* Private Routes for Users/Affiliates */}
                            <Route 
                                path="/affiliate-dashboard" 
                                element={
                                    <PrivateRoute roles={['user']}>
                                        <AffiliateDashboardScreen />
                                    </PrivateRoute>
                                } 
                            />

                            {/* Private Routes for Admin */}
                            <Route 
                                path="/admin-dashboard" 
                                element={
                                    <PrivateRoute roles={['admin']}>
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
