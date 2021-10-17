const mongoose = require('mongoose')

module.exports.CustomerSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String
})