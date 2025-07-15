import React from 'react';

const Footer = () => {
    return (
        <footer style={{ 
            background: '#333', 
            color: '#fff', 
            textAlign: 'center', 
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Affiliate Platform - MERN Stack College Project. All rights reserved.
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                    Built with ❤️ using MongoDB, Express.js, React.js & Node.js
                </p>
            </div>
        </footer>
    );
};

export default Footer;
