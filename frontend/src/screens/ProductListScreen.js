import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <div className="loading">
            <h3>🔄 Loading products...</h3>
        </div>
    );
    
    if (error) return (
        <div className="alert alert-danger">
            {error}
        </div>
    );

    return (
        <div>
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '40px',
                padding: '40px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                color: 'white'
            }}>
                <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem' }}>
                    🛍️ Product Marketplace
                </h1>
                <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.9 }}>
                    Discover amazing products and start earning through affiliate marketing!
                </p>
            </div>

            {products.length === 0 ? (
                <div className="card text-center">
                    <h3>📦 No Products Available</h3>
                    <p>Check back later for new products to promote!</p>
                </div>
            ) : (
                <>
                    <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>
                        Available Products ({products.length})
                    </h2>
                    <div className="grid grid-4">
                        {products.map((product) => (
                            <div key={product._id} className="card" style={{
                                textAlign: 'center',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}>
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        objectFit: 'cover', 
                                        borderRadius: '8px',
                                        marginBottom: '15px' 
                                    }} 
                                />
                                <h3 style={{ 
                                    margin: '0 0 10px 0', 
                                    color: '#333',
                                    fontSize: '1.3rem'
                                }}>
                                    {product.name}
                                </h3>
                                <p style={{ 
                                    color: '#666', 
                                    marginBottom: '15px',
                                    lineHeight: '1.5'
                                }}>
                                    {product.description}
                                </p>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#28a745',
                                    marginBottom: '15px'
                                }}>
                                    ${product.price.toFixed(2)}
                                </div>
                                <div style={{
                                    padding: '10px',
                                    background: '#e9ecef',
                                    borderRadius: '5px',
                                    fontSize: '0.9rem',
                                    color: '#666'
                                }}>
                                    💡 Login as an affiliate to generate your link for this product
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div style={{
                marginTop: '50px',
                textAlign: 'center',
                padding: '30px',
                background: '#f8f9fa',
                borderRadius: '10px'
            }}>
                <h3 style={{ marginBottom: '15px' }}>🚀 Ready to Start Earning?</h3>
                <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
                    Join our affiliate program and start earning commissions from these amazing products!
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <Link to="/register" className="btn btn-success" style={{ textDecoration: 'none' }}>
                        Register as Affiliate
                    </Link>
                    <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        Login to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductListScreen;
