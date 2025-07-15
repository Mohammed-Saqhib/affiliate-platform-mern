import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles, userInfo }) => {
    if (!userInfo) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(userInfo.role)) {
        // Logged in but not authorized, redirect to home
        // Or to a specific dashboard if they have a role
        if (userInfo.role === 'user') {
            return <Navigate to="/affiliate-dashboard" />;
        }
        // If they are neither admin nor user, or trying to access a page they shouldn't
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
