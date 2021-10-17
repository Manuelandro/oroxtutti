const mongoose = require('mongoose')

module.exports = async function() {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI)
        return conn
    } catch (err) {
        console.log(err)
        return err
    }
}
