const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: String,
    qty: Number,
    price: Number,
    priceId: String,
    subtotal: Number
})


module.exports.CustomerSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String,
    token: String
})

module.exports.CartSchema = new mongoose.Schema({
    customerId: String,
    items: [ItemSchema]
})

module.exports.OrderSchema = new mongoose.Schema({
    amount_total: Number,
    customer: String,
    payment_intent: String,
    payment_status: String
})