import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AffiliateDashboardScreen = () => {
    const [products, setProducts] = useState([]);
    const [myLinks, setMyLinks] = useState([]);
    const [myTransactions, setMyTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [generateLoading, setGenerateLoading] = useState(null);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, myLinksRes, myTransactionsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/products`),
                axios.get(`${API_BASE_URL}/affiliate/my-links`, config),
                axios.get(`${API_BASE_URL}/affiliate/my-transactions`, config)
            ]);

            setProducts(productsRes.data);
            setMyLinks(myLinksRes.data);
            setMyTransactions(myTransactionsRes.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const generateLinkHandler = async (productId) => {
        setGenerateLoading(productId);
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/affiliate/generate-link`, 
                { productId }, 
                config
            );
            
            // Check if link already exists or add new one
            if (data.link) {
                // Link already exists
                alert('Affiliate link already exists for this product!');
            } else {
                // Add new link to state
                const product = products.find(p => p._id === productId);
                setMyLinks(prev => [...prev, { ...data, product }]);
                alert('Affiliate link generated successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate link.');
        } finally {
            setGenerateLoading(null);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return (
        <div className="loading">
            <h3>🔄 Loading your dashboard...</h3>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger">
            {error}
        </div>
    );

    const totalEarnings = myTransactions.reduce((acc, trans) => acc + trans.commissionEarned, 0).toFixed(2);
    const pendingEarnings = myTransactions.filter(t => t.status === 'pending').reduce((acc, trans) => acc + trans.commissionEarned, 0).toFixed(2);
    const paidEarnings = myTransactions.filter(t => t.status === 'paid').reduce((acc, trans) => acc + trans.commissionEarned, 0).toFixed(2);

    return (
        <div>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                padding: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                color: 'white'
            }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem' }}>
                    💼 Affiliate Dashboard
                </h1>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
                    Welcome back, {userInfo?.username}! Track your performance and earnings.
                </p>
            </div>

            {/* Earnings Statistics */}
            <div className="stats-grid">
                <div className="stat-card earnings">
                    <div className="stat-value">${totalEarnings}</div>
                    <div className="stat-label">💰 Total Earned</div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-value">${pendingEarnings}</div>
                    <div className="stat-label">⏳ Pending Payment</div>
                </div>
                <div className="stat-card paid">
                    <div className="stat-value">${paidEarnings}</div>
                    <div className="stat-label">✅ Paid Out</div>
                </div>
            </div>

            {/* Products for Link Generation */}
            <div className="card">
                <h3>🛍️ Generate Affiliate Links</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Click "Generate Link" to create your unique affiliate link for any product.
                </p>
                {products.length === 0 ? (
                    <p>No products available for affiliate links.</p>
                ) : (
                    <div className="grid grid-3">
                        {products.map((product) => {
                            const hasLink = myLinks.some(link => link.product?._id === product._id);
                            return (
                                <div key={product._id} style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    background: hasLink ? '#f8f9fa' : 'white'
                                }}>
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        style={{ 
                                            width: '100%', 
                                            height: '150px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            marginBottom: '15px' 
                                        }} 
                                    />
                                    <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
                                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                                        {product.description}
                                    </p>
                                    <p style={{ 
                                        fontWeight: 'bold', 
                                        color: '#28a745', 
                                        fontSize: '1.2rem',
                                        marginBottom: '15px' 
                                    }}>
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => generateLinkHandler(product._id)}
                                        className={hasLink ? "btn btn-success" : "btn btn-primary"}
                                        disabled={generateLoading === product._id}
                                        style={{ width: '100%' }}
                                    >
                                        {generateLoading === product._id ? 
                                            'Generating...' : 
                                            hasLink ? '✅ Link Generated' : '🔗 Generate Link'
                                        }
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* My Generated Links */}
            <div className="card">
                <h3>🔗 My Generated Links</h3>
                {myLinks.length === 0 ? (
                    <p style={{ color: '#666' }}>
                        No affiliate links generated yet. Generate your first link above!
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Affiliate Link</th>
                                    <th>Clicks</th>
                                    <th>Purchases</th>
                                    <th>Conversion Rate</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLinks.map((link) => {
                                    const conversionRate = link.clicks > 0 ? 
                                        ((link.purchases / link.clicks) * 100).toFixed(1) : '0.0';
                                    const fullLink = `http://localhost:5000/api/affiliate/track/${link.shortCode}`;
                                    
                                    return (
                                        <tr key={link._id}>
                                            <td>
                                                <strong>{link.product?.name || 'N/A'}</strong>
                                                <br />
                                                <small style={{ color: '#666' }}>
                                                    ${link.product?.price?.toFixed(2) || '0.00'}
                                                </small>
                                            </td>
                                            <td>
                                                <div style={{ 
                                                    maxWidth: '200px', 
                                                    wordBreak: 'break-all',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {fullLink}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    background: '#e9ecef', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px' 
                                                }}>
                                                    {link.clicks}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    background: link.purchases > 0 ? '#d4edda' : '#f8d7da', 
                                                    color: link.purchases > 0 ? '#155724' : '#721c24',
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px' 
                                                }}>
                                                    {link.purchases}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    fontWeight: 'bold',
                                                    color: parseFloat(conversionRate) > 0 ? '#28a745' : '#666'
                                                }}>
                                                    {conversionRate}%
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => copyToClipboard(fullLink)}
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                                >
                                                    📋 Copy
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* My Transactions */}
            <div className="card">
                <h3>💳 My Transactions</h3>
                {myTransactions.length === 0 ? (
                    <p style={{ color: '#666' }}>
                        No transactions yet. Share your affiliate links to start earning!
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Link ID</th>
                                    <th>Sale Amount</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTransactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>
                                            <strong>{transaction.product?.name || 'N/A'}</strong>
                                        </td>
                                        <td>
                                            <code style={{ 
                                                background: '#f8f9fa', 
                                                padding: '2px 6px',
                                                borderRadius: '3px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {transaction.affiliateLink?.shortCode || 'N/A'}
                                            </code>
                                        </td>
                                        <td>
                                            <strong>${transaction.amount.toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            <strong style={{ color: '#28a745' }}>
                                                ${transaction.commissionEarned.toFixed(2)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                background: transaction.status === 'paid' ? '#d4edda' : '#fff3cd',
                                                color: transaction.status === 'paid' ? '#155724' : '#856404'
                                            }}>
                                                {transaction.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.9rem' }}>
                                            {new Date(transaction.purchasedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AffiliateDashboardScreen;
