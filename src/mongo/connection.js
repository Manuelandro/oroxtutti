const mongoose = require('mongoose')

module.exports = async function() {
    const conn = await mongoose.connect(process.env.DATABASE_URI)
    return conn
}
