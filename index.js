require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001

const Products = require('./src/api/Products')
const Customers = require('./src/api/Customers')
const Cart = require('./src/api/Cart')
const Payments = require('./src/api/Payments')

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json())
app.post('/products/list', Products.retrieveProducts)
app.post('/products/prices/list', Products.retrievePrices)
app.post('/product', Products.retrieveProduct)
app.post('/product/price', Products.retrieveSinglePrice)
app.post('/customers/create', Customers.createCustomer)
app.post('/customers/login', Customers.customerLogin)
app.get('/customers/info', Customers.customerInfo)
app.post('/cart/get', Cart.retrieveCart)
app.post('/cart/add', Cart.addToCart)
app.post('/cart/remove', Cart.removeFromCart)
app.post('/cart/update', Cart.updateQtyInCart)
app.post('/payment/create', Payments.createPaymentIntent)
app.post('/payment/method', Payments.createPaymentMethod)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})