const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const autoCatch = require('./lib/auto-catch');
const Products = require('./products');
const Orders = require('./orders');

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve the root HTML file
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

// Product endpoints
async function listProducts(req, res) {
  const { offset = 0, limit = 25, tag } = req.query;
  res.json(await Products.list({ offset: Number(offset), limit: Number(limit), tag }));
}

async function getProduct(req, res, next) {
  const { id } = req.params;
  const product = await Products.get(id);
  if (!product) return next();
  res.json(product);
}

async function createProduct(req, res) {
  const product = await Products.create(req.body);
  res.json(product);
}

async function editProduct(req, res, next) {
  const product = await Products.edit(req.params.id, req.body);
  res.json(product);
}

async function deleteProduct(req, res, next) {
  await Products.destroy(req.params.id);
  res.status(204).send(); // 204 No Content
}

// Order endpoints
async function createOrder(req, res, next) {
  const order = await Orders.create(req.body);
  res.json(order);
}

async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query;
  const orders = await Orders.list({ offset: Number(offset), limit: Number(limit), productId, status });
  res.json(orders);
}

async function getOrder(req, res, next) {
  const order = await Orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}

async function editOrder(req, res, next) {
  const updatedOrder = await Orders.edit(req.params.id, req.body);
  res.json(updatedOrder);
}

async function deleteOrder(req, res, next) {
  await Orders.destroy(req.params.id);
  res.status(204).send(); // 204 No Content
}

// Register routes
app.get('/', handleRoot); // Root route

// Products API
app.get('/products', autoCatch(listProducts));
app.get('/products/:id', autoCatch(getProduct));
app.post('/products', autoCatch(createProduct));
app.put('/products/:id', autoCatch(editProduct));
app.delete('/products/:id', autoCatch(deleteProduct));

// Orders API
app.get('/orders', autoCatch(listOrders));
app.get('/orders/:id', autoCatch(getOrder));
app.post('/orders', autoCatch(createOrder));
app.put('/orders/:id', autoCatch(editOrder));
app.delete('/orders/:id', autoCatch(deleteOrder));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

module.exports = app;
