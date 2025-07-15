import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <header style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff', 
            padding: '1rem 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div className="container" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <h1 style={{ margin: 0 }}>
                    <Link to="/" style={{ 
                        color: '#fff', 
                        textDecoration: 'none',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        🚀 Affiliate Platform
                    </Link>
                </h1>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {userInfo ? (
                        <>
                            {userInfo.role === 'admin' && (
                                <Link 
                                    to="/admin-dashboard" 
                                    style={{ 
                                        color: '#fff', 
                                        textDecoration: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '5px',
                                        background: 'rgba(255,255,255,0.2)',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    📊 Admin Dashboard
                                </Link>
                            )}
                            {userInfo.role === 'user' && (
                                <Link 
                                    to="/affiliate-dashboard" 
                                    style={{ 
                                        color: '#fff', 
                                        textDecoration: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '5px',
                                        background: 'rgba(255,255,255,0.2)',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    💼 My Dashboard
                                </Link>
                            )}
                            <span style={{ 
                                color: '#fff',
                                fontSize: '0.9rem',
                                opacity: 0.9
                            }}>
                                Hello, {userInfo.username}
                            </span>
                            <button 
                                onClick={logoutHandler} 
                                className="btn btn-danger"
                                style={{ fontSize: '0.9rem' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                style={{ 
                                    color: '#fff', 
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '5px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.1)';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                                }}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="btn btn-success"
                                style={{ textDecoration: 'none' }}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
