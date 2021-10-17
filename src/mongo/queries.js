const mongoConn = require('./connection')
const { CustomerSchema } = require('./schemas')

/**
 *  CUSTOMER
 */
module.exports.getCustomerExists = async function(email = '') {
    try {
        const connection = await mongoConn()
        const found = await connection.model('Customer', CustomerSchema).find({ email })

        return found
    } catch (err) {
        console.log(err)
    }
}

module.exports.getCustomerLogin = async function(email = '', password = '') {
    try {
        const connection = await mongoConn()
        const found = await connection.model('Customer', CustomerSchema).find({ email, password })
        return found
    } catch (err) {
        console.log(err)
    }
}

module.exports.updateCustomer = async function(values = {}) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Customer', CustomerSchema).updateOne(
            { email: values.email }, { token: values.token}
        )
        if (!res.modifiedCount) {
            throw new Error("No customers matched")
        }
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

module.exports.setCustomer = async function(values = {}) {
    try {
        const connection = await mongoConn()
        const Customer = await connection.model('Customer', CustomerSchema)

        const newCustomer = new Customer({
            ...values
        })
        await newCustomer.save()

        return newCustomer
    } catch (err) {
        console.log(err)
    }
}