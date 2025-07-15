import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    if (!userInfo) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(userInfo.role)) {
        // Logged in but not authorized, redirect to home
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
