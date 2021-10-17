const mongoConn = require('./connection')
const { CustomerSchema, CartSchema } = require('./schemas')

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

module.exports.updateCustomer = async function({ email, ...rest }) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Customer', CustomerSchema).updateOne(
            { email: email }, { ...rest }
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


/**
 * CART
 */

module.exports.getCart = async function(customerId) {
    try {
        const connection = await mongoConn()
        const found = await connection.model('Cart', CartSchema).find({ customerId })
        return found
    } catch (err) {
        console.log(err)
    }
}


module.exports.createCart = async function(customerId, itemId, qty) {
    try {
        const connection = await mongoConn()
        const Cart = await connection.model('Cart', CartSchema)

        const newCart = new Cart({
            customerId,
            items: [{
                id: itemId,
                qty
            }]
        })

        await newCart.save()

        return newCart
    } catch (err) {
        console.log(err)
    }
}

module.exports.updateCart = async function(customerId, itemId, qty) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Cart', CartSchema).updateOne(
            {
                customerId,
                "items.id": itemId
            },
            {
                "$set": {
                    "items.$.qty": qty
                }
            }
        )

        if (!res.modifiedCount) {
            throw new Error("No carts matched")
        }
        return true
    } catch (err) {
        console.log(err)
    }
}

module.exports.removeFromCart = async function(customerId, itemId) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Cart', CartSchema).updateOne({
            customerId,
        }, {
            "$pull": {
                "items": { id: itemId }
            }
        })
        return res
    } catch (err) {
        console.log(err)
    }
}


module.exports.deleteCart = async function(customerId) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Cart', CartSchema).deleteOne({ customerId })
        return res
    } catch (err) {
        console.log(err)
    }
}