const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: String,
    qty: Number,
    price: Number,
    priceId: String,
    subtotal: Number
})

const AddressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String
    }
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
    items: [ItemSchema],
    payment_intent: String,
    payment_status: String,
    shipping: AddressSchema
})