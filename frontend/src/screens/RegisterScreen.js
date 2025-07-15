import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/register', { 
                username, 
                email, 
                password, 
                role 
            });
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            if (data.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/affiliate-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
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
                📝 Register
            </h2>
            
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                
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
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="role">Register as</label>
                    <select 
                        id="role" 
                        className="form-control"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">Affiliate User</option>
                        <option value="admin">Admin (Demo Only)</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-success"
                    style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
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
                    Already have an account? {' '}
                    <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
