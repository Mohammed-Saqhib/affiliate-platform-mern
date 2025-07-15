import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ userInfo, onLogout }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <header style={{
            background: 'linear-gradient(90deg, #4b6cb7, #182848)',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
            <div className="logo">
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    🚀 Affiliate Platform
                </Link>
            </div>
            <nav>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', alignItems: 'center', margin: 0 }}>
                    {userInfo ? (
                        <>
                            {userInfo.role === 'admin' && (
                                <li>
                                    <Link to="/admin-dashboard" className="btn btn-light">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}
                            {userInfo.role === 'user' && (
                                <li>
                                    <Link to="/affiliate-dashboard" className="btn btn-light">
                                        Affiliate Dashboard
                                    </Link>
                                </li>
                            )}
                            <li style={{ color: '#f0f0f0' }}>
                                Hello, {userInfo.username}
                            </li>
                            <li>
                                <button onClick={logoutHandler} className="btn btn-danger">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-outline-light">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-warning">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
