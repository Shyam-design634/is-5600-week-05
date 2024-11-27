const fs = require('fs').promises;
const path = require('path');
const cuid = require('cuid');
const db = require('./db');

const productsFile = path.join(__dirname, 'data/full-products.json');

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }],
});

/**
 * List products
 * @param {*} options 
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  // Read the products from the JSON file
  const data = await fs.readFile(productsFile);
  const products = JSON.parse(data);

  // Filter products by tag if specified
  const filteredProducts = products.filter(product => {
    if (!tag) return true;
    return product.tags.some(({ title }) => title === tag);
  });

  // Slice the products to apply pagination
  return filteredProducts.slice(offset, offset + limit);
}

/**
 * Get a single product by ID from the database
 * @param {string} _id
 * @returns {Promise<object>}
 */
async function get(_id) {
  const product = await Product.findById(_id);
  return product;
}

/**
 * Create a new product
 * @param {object} fields
 * @returns {Promise<object>}
 */
async function create(fields) {
  const product = await new Product(fields).save();
  return product;
}

/**
 * Edit a product by ID
 * @param {string} _id
 * @param {object} change
 * @returns {Promise<object>}
 */
async function edit(_id, change) {
  const product = await get(_id);

  Object.keys(change).forEach(function (key) {
    product[key] = change[key];
  });

  await product.save();

  return product;
}

/**
 * Delete a product by ID
 * @param {string} _id
 * @returns {Promise<void>}
 */
async function destroy(_id) {
  await Product.deleteOne({ _id });
}

module.exports = {
  list,
  create,
  edit,
  destroy,
  get
};
