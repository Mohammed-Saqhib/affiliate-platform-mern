import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboardScreen = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        description: '', 
        price: '', 
        imageUrl: '' 
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [simulateLoading, setSimulateLoading] = useState(null);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [productsRes, transactionsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products', config),
                axios.get('http://localhost:5000/api/affiliate/transactions', config)
            ]);

            setProducts(productsRes.data);
            setTransactions(transactionsRes.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch admin data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNewProductChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await axios.post('http://localhost:5000/api/products', {
                ...newProduct,
                price: parseFloat(newProduct.price)
            }, config);
            setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
            fetchAllData();
            alert('Product created successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchAllData();
                alert('Product deleted!');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete product.');
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct({ ...product });
    };

    const handleEditChange = (e) => {
        setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, {
                ...editingProduct,
                price: parseFloat(editingProduct.price)
            }, config);
            setEditingProduct(null);
            fetchAllData();
            alert('Product updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSimulatePurchase = async (shortCode) => {
        setSimulateLoading(shortCode);
        try {
            await axios.post('http://localhost:5000/api/affiliate/purchase', { shortCode }, config);
            fetchAllData();
            alert('Purchase simulated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to simulate purchase.');
        } finally {
            setSimulateLoading(null);
        }
    };

    const handleMarkAsPaid = async (transactionId) => {
        if (window.confirm('Mark this transaction as paid?')) {
            try {
                await axios.put(`http://localhost:5000/api/affiliate/transactions/${transactionId}/pay`, {}, config);
                fetchAllData();
                alert('Transaction marked as paid!');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to mark as paid.');
            }
        }
    };

    if (loading) return (
        <div className="loading">
            <h3>🔄 Loading admin dashboard...</h3>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger">
            {error}
        </div>
    );

    // Calculate statistics
    const totalRevenue = transactions.reduce((acc, trans) => acc + trans.amount, 0);
    const totalCommissions = transactions.reduce((acc, trans) => acc + trans.commissionEarned, 0);
    const pendingPayments = transactions.filter(t => t.status === 'pending').length;

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
                    📊 Admin Dashboard
                </h1>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
                    Manage products, track sales, and handle affiliate payments.
                </p>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-label">🛍️ Total Products</div>
                </div>
                <div className="stat-card earnings">
                    <div className="stat-value">${totalRevenue.toFixed(2)}</div>
                    <div className="stat-label">💰 Total Revenue</div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-value">${totalCommissions.toFixed(2)}</div>
                    <div className="stat-label">💳 Total Commissions</div>
                </div>
                <div className="stat-card paid">
                    <div className="stat-value">{pendingPayments}</div>
                    <div className="stat-label">⏳ Pending Payments</div>
                </div>
            </div>

            {/* Product Management */}
            <div className="card">
                <h3>🛍️ Product Management</h3>
                
                {/* Add New Product Form */}
                <div style={{ 
                    marginBottom: '30px', 
                    padding: '25px', 
                    background: '#f8f9fa', 
                    borderRadius: '10px' 
                }}>
                    <h4 style={{ marginBottom: '20px' }}>Add New Product</h4>
                    <form onSubmit={handleCreateProduct}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: '15px' 
                        }}>
                            <div className="form-group">
                                <label htmlFor="name">Product Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="form-control"
                                    value={newProduct.name} 
                                    onChange={handleNewProductChange} 
                                    required 
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    className="form-control"
                                    value={newProduct.price} 
                                    onChange={handleNewProductChange} 
                                    required 
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea 
                                name="description" 
                                className="form-control"
                                value={newProduct.description} 
                                onChange={handleNewProductChange} 
                                required
                                rows="3"
                                placeholder="Enter product description"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL</label>
                            <input 
                                type="url" 
                                name="imageUrl" 
                                className="form-control"
                                value={newProduct.imageUrl} 
                                onChange={handleNewProductChange}
                                placeholder="https://example.com/image.jpg (optional)"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={submitLoading}
                        >
                            {submitLoading ? 'Creating...' : '✅ Add Product'}
                        </button>
                    </form>
                </div>

                {/* Existing Products */}
                <h4>Existing Products ({products.length})</h4>
                {products.length === 0 ? (
                    <p style={{ color: '#666' }}>No products available. Add your first product above!</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </td>
                                        <td><strong>{product.name}</strong></td>
                                        <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                                            {product.description}
                                        </td>
                                        <td>
                                            <strong style={{ color: '#28a745' }}>
                                                ${product.price.toFixed(2)}
                                            </strong>
                                        </td>
                                        <td style={{ fontSize: '0.9rem' }}>
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button 
                                                    onClick={() => handleEditClick(product)} 
                                                    className="btn btn-warning"
                                                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)} 
                                                    className="btn btn-danger"
                                                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h4 style={{ marginBottom: '20px' }}>✏️ Edit Product</h4>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="form-group">
                                <label htmlFor="editName">Product Name</label>
                                <input 
                                    type="text" 
                                    id="editName" 
                                    name="name" 
                                    className="form-control"
                                    value={editingProduct.name} 
                                    onChange={handleEditChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editDescription">Description</label>
                                <textarea 
                                    id="editDescription" 
                                    name="description" 
                                    className="form-control"
                                    value={editingProduct.description} 
                                    onChange={handleEditChange} 
                                    required
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editPrice">Price ($)</label>
                                <input 
                                    type="number" 
                                    id="editPrice" 
                                    name="price" 
                                    className="form-control"
                                    value={editingProduct.price} 
                                    onChange={handleEditChange} 
                                    required 
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editImageUrl">Image URL</label>
                                <input 
                                    type="url" 
                                    id="editImageUrl" 
                                    name="imageUrl" 
                                    className="form-control"
                                    value={editingProduct.imageUrl} 
                                    onChange={handleEditChange} 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setEditingProduct(null)} 
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transactions Management */}
            <div className="card">
                <h3>💳 Transaction Management</h3>
                {transactions.length === 0 ? (
                    <p style={{ color: '#666' }}>No transactions recorded yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Affiliate</th>
                                    <th>Link</th>
                                    <th>Sale Amount</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>
                                            <strong>{transaction.product?.name || 'N/A'}</strong>
                                        </td>
                                        <td>
                                            <strong>{transaction.affiliate?.username || 'N/A'}</strong>
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
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                {transaction.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleMarkAsPaid(transaction._id)} 
                                                        className="btn btn-success"
                                                        style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                                    >
                                                        💰 Mark Paid
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleSimulatePurchase(transaction.affiliateLink?.shortCode)} 
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                                    disabled={simulateLoading === transaction.affiliateLink?.shortCode}
                                                >
                                                    {simulateLoading === transaction.affiliateLink?.shortCode ? 
                                                        'Simulating...' : '🔄 Simulate Purchase'
                                                    }
                                                </button>
                                            </div>
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

export default AdminDashboardScreen;
