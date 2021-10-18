require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001

const Products = require('./src/api/Products')
const Customers = require('./src/api/Customers')
const Cart = require('./src/api/Cart')
const Payments = require('./src/api/Payments')

app.use(express.json())
app.post('/products/list', Products.retrieveProducts)
app.post('/products/prices/list', Products.retrievePrices)
app.post('/product', Products.retrieveProduct)
app.post('/customers/create', Customers.createCustomer)
app.post('/customers/create/login', Customers.createCustomerLogin)
app.post('/customers/login', Customers.customerLogin)
app.post('/cart/get', Cart.retrieveCart)
app.post('/cart/add', Cart.addToCart)
app.post('/cart/remove', Cart.removeFromCart)
app.post('/cart/update', Cart.updateQtyInCart)
app.post('/payment/create', Payments.createPaymentIntent)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})