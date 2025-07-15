// Production database configuration for Vercel
const path = require('path');
const fs = require('fs');

class ProductionDatabase {
    constructor() {
        this.data = {
            users: [],
            products: [],
            affiliateLinks: [],
            transactions: []
        };
        this.loadInitialData();
    }

    loadInitialData() {
        // Load initial seed data for production
        const seedData = {
            users: [
                {
                    username: 'admin',
                    email: 'admin@example.com',
                    password: '$2b$10$1qAOInyF/CC6nTeF4hlDDefmKMepOoaVD7HeRZtcIvut4Psdq2Uly', // admin123
                    role: 'admin',
                    isActive: true,
                    id: 'admin001',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            products: [
                {
                    name: 'Wireless Bluetooth Headphones',
                    description: 'High-quality wireless headphones with noise cancellation',
                    price: 99.99,
                    commission: 15,
                    imageUrl: 'https://via.placeholder.com/300x300/007bff/ffffff?text=Headphones',
                    category: 'Electronics',
                    isActive: true,
                    id: 'prod001',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    name: 'Smart Fitness Watch',
                    description: 'Track your fitness goals with this advanced smartwatch',
                    price: 199.99,
                    commission: 25,
                    imageUrl: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Smart+Watch',
                    category: 'Fitness',
                    isActive: true,
                    id: 'prod002',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    name: 'Portable Laptop Stand',
                    description: 'Ergonomic laptop stand for better posture and productivity',
                    price: 49.99,
                    commission: 8,
                    imageUrl: 'https://via.placeholder.com/300x300/ffc107/000000?text=Laptop+Stand',
                    category: 'Accessories',
                    isActive: true,
                    id: 'prod003',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            affiliateLinks: [],
            transactions: []
        };

        this.data = seedData;
    }

    // Generic database operations
    findAll(collection) {
        return this.data[collection] || [];
    }

    findById(collection, id) {
        const items = this.data[collection] || [];
        return items.find(item => item.id === id);
    }

    findOne(collection, criteria) {
        const items = this.data[collection] || [];
        return items.find(item => {
            return Object.keys(criteria).every(key => item[key] === criteria[key]);
        });
    }

    create(collection, itemData) {
        const items = this.data[collection] || [];
        const newItem = {
            ...itemData,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
    }

    updateById(collection, id, updateData) {
        const items = this.data[collection] || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            return items[index];
        }
        return null;
    }

    deleteById(collection, id) {
        const items = this.data[collection] || [];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            return items.splice(index, 1)[0];
        }
        return null;
    }

    count(collection, criteria = {}) {
        const items = this.data[collection] || [];
        if (Object.keys(criteria).length === 0) {
            return items.length;
        }
        return items.filter(item => {
            return Object.keys(criteria).every(key => item[key] === criteria[key]);
        }).length;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Export a singleton instance
const productionDB = new ProductionDatabase();
module.exports = productionDB;
