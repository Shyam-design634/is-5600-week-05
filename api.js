* @param {object} res 
*/
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
  const product = await Products.create(req.body)
  res.json(product)
}

/**
 * Edit a product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * Update a product
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function editProduct(req, res, next) {
  console.log(req.body)
  res.json(req.body)
async function editProduct (req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}
}

/**
 * Delete a product
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function deleteProduct(req, res, next) {
  res.json({ success: true })
async function deleteProduct (req, res, next) {
  const response = await Products.destroy(req.params.id)
  res.json(response)
}
}

async function createOrder (req, res, next) {
  const order = await Orders.create(req.body)
  res.json(orders)
}

async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}

async function editOrders(req, res, next) {
  const change = req.body
  const order = await Orders.edit(req.params.id, change)
  res.json(orders)
}

async function deleteOrders (req, res, next) {
  const response = await Orders.destroy(req.params.id)
  res.json(response)
}

module.exports = autoCatch({
@@ -81,5 +112,9 @@ module.exports = autoCatch({
  getProduct,
  createProduct,
  editProduct,
  deleteProduct
});
  listOrders,
  createOrder,
  deleteOrders,
  editOrders,
});

