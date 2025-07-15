import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/login', { 
                email, 
                password 
            });
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            if (data.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/affiliate-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '50px auto', 
            padding: '30px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '30px', 
                color: '#333',
                fontSize: '1.8rem'
            }}>
                🔐 Login
            </h2>
            
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '5px'
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Don't have an account? {' '}
                    <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Register here
                    </Link>
                </p>
            </div>
            
            <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: '#e9ecef', 
                borderRadius: '5px',
                fontSize: '0.8rem'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Demo Credentials:</h4>
                <p style={{ margin: '5px 0' }}><strong>Admin:</strong> admin@demo.com / admin123</p>
                <p style={{ margin: '5px 0' }}><strong>User:</strong> user@demo.com / user123</p>
            </div>
        </div>
    );
};

export default LoginScreen;
