const { string } = require('joi')
const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: String,
    qty: Number
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