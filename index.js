require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001

const mongoose = require('./src/mongo/')

const Products = require('./src/api/Products')
const Customers = require('./src/api/Customers')
const Payments = require('./src/api/Payments')

// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.use(express.json())
app.post('/products/list', Products.retrieveProducts)
app.post('/product', Products.retrieveProduct)
app.post('/customers/create', Customers.createCustomer)
app.post('/customers/create/login', Customers.createCustomerLogin)
app.post('/payment/create', Payments.createPaymentIntent)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})