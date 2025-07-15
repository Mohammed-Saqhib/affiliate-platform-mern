const { productsDB } = require('../config/jsonDatabase');

class Product {
  static create(productData) {
    // Validate required fields
    if (!productData.name || !productData.price) {
      throw new Error('Product name and price are required');
    }

    // Check if product with same name exists
    const existingProduct = productsDB.findOne({ name: productData.name });
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }

    // Create product object
    const product = {
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price),
      commission: parseFloat(productData.commission) || 0,
      imageUrl: productData.imageUrl || 'https://via.placeholder.com/150',
      category: productData.category || 'general',
      isActive: productData.isActive !== undefined ? productData.isActive : true
    };

    return productsDB.create(product);
  }

  static findOne(criteria) {
    return productsDB.findOne(criteria);
  }

  static findByPk(id) {
    return productsDB.findById(id);
  }

  static findAll(criteria = {}) {
    return productsDB.findAll(criteria);
  }

  static updateByPk(id, updateData) {
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.commission) {
      updateData.commission = parseFloat(updateData.commission);
    }
    return productsDB.updateById(id, updateData);
  }

  static deleteByPk(id) {
    return productsDB.deleteById(id);
  }

  static count(criteria = {}) {
    return productsDB.count(criteria);
  }

  static findActive() {
    return productsDB.findAll({ isActive: true });
  }
}

module.exports = Product;
