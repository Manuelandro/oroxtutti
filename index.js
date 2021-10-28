require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

const Products = require('./src/api/Products')
const Customers = require('./src/api/Customers')
const Cart = require('./src/api/Cart')
const Payments = require('./src/api/Payments')

app.use(cors())
app.use(express.json())
app.post('/products/list', Products.retrieveProducts)
app.post('/products/prices/list', Products.retrievePrices)
app.post('/product', Products.retrieveProduct)
app.post('/product/price', Products.retrieveSinglePrice)
app.post('/customers/create', Customers.createCustomer)
app.post('/customers/login', Customers.customerLogin)
app.post('/customers/update/shipping', Customers.customerUpdateShipping)
app.get('/customers/info', Customers.customerInfo)
app.get('/cart/get', Cart.retrieveCart)
app.post('/cart/add', Cart.addToCart)
app.delete('/cart/remove', Cart.removeFromCart)
app.put('/cart/update', Cart.updateQtyInCart)
app.post('/payment/create', Payments.createPaymentIntent)
app.post('/payment/method', Payments.createPaymentMethod)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})