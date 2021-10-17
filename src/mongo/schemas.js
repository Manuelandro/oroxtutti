const { string } = require('joi')
const mongoose = require('mongoose')

module.exports.CustomerSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String,
    token: String
})

module.exports.CartSchema = new mongoose.Schema({
    id: Number,
    customerId: String,
    items: [String]
})