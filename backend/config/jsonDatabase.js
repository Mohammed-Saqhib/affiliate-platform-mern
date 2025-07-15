const fs = require('fs');
const path = require('path');

// File paths for JSON databases
const dbDir = path.join(__dirname, '../data');
const usersFile = path.join(dbDir, 'users.json');
const productsFile = path.join(dbDir, 'products.json');
const affiliateLinksFile = path.join(dbDir, 'affiliateLinks.json');
const transactionsFile = path.join(dbDir, 'transactions.json');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize JSON files if they don't exist
const initializeFiles = () => {
    const files = [
        { path: usersFile, data: [] },
        { path: productsFile, data: [] },
        { path: affiliateLinksFile, data: [] },
        { path: transactionsFile, data: [] }
    ];

    files.forEach(file => {
        if (!fs.existsSync(file.path)) {
            fs.writeFileSync(file.path, JSON.stringify(file.data, null, 2));
        }
    });
};

// Generic database operations
class JSONDatabase {
    constructor(filename) {
        this.filename = filename;
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, JSON.stringify([], null, 2));
        }
    }

    readAll() {
        try {
            const data = fs.readFileSync(this.filename, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${this.filename}:`, error);
            return [];
        }
    }

    writeAll(data) {
        try {
            fs.writeFileSync(this.filename, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing ${this.filename}:`, error);
            return false;
        }
    }

    findById(id) {
        const data = this.readAll();
        return data.find(item => item.id === id);
    }

    findOne(criteria) {
        const data = this.readAll();
        return data.find(item => {
            return Object.keys(criteria).every(key => {
                return item[key] === criteria[key];
            });
        });
    }

    findAll(criteria = {}) {
        const data = this.readAll();
        if (Object.keys(criteria).length === 0) {
            return data;
        }
        return data.filter(item => {
            return Object.keys(criteria).every(key => {
                return item[key] === criteria[key];
            });
        });
    }

    create(newItem) {
        const data = this.readAll();
        
        // Generate ID if not provided
        if (!newItem.id) {
            newItem.id = this.generateId();
        }

        // Add timestamps
        newItem.createdAt = new Date().toISOString();
        newItem.updatedAt = new Date().toISOString();

        data.push(newItem);
        
        if (this.writeAll(data)) {
            return newItem;
        }
        return null;
    }

    updateById(id, updateData) {
        const data = this.readAll();
        const index = data.findIndex(item => item.id === id);
        
        if (index === -1) {
            return null;
        }

        // Update timestamp
        updateData.updatedAt = new Date().toISOString();
        
        data[index] = { ...data[index], ...updateData };
        
        if (this.writeAll(data)) {
            return data[index];
        }
        return null;
    }

    deleteById(id) {
        const data = this.readAll();
        const index = data.findIndex(item => item.id === id);
        
        if (index === -1) {
            return false;
        }

        data.splice(index, 1);
        return this.writeAll(data);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    count(criteria = {}) {
        return this.findAll(criteria).length;
    }
}

// Create database instances
const usersDB = new JSONDatabase(usersFile);
const productsDB = new JSONDatabase(productsFile);
const affiliateLinksDB = new JSONDatabase(affiliateLinksFile);
const transactionsDB = new JSONDatabase(transactionsFile);

// Initialize all files
initializeFiles();

module.exports = {
    usersDB,
    productsDB,
    affiliateLinksDB,
    transactionsDB,
    JSONDatabase
};
