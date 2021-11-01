require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

const Products = require('./src/api/Products')
const Customers = require('./src/api/Customers')
const Cart = require('./src/api/Cart')
const Payments = require('./src/api/Payments')
const Orders = require('./src/api/Orders')

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
app.post('/payment/session/create', Payments.createSession)
app.post('/payment/session/get', Payments.retrieveSession)
app.post('/payment/webhook', Payments.fulfillOrder)
app.get('/orders/list', Orders.getOrders)
app.post('/orders/order', Orders.getOrder)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})