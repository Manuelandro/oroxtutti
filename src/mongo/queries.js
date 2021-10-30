const mongoConn = require('./connection')
const { CustomerSchema, CartSchema, OrderSchema } = require('./schemas')

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
        const found = await connection.model('Cart', CartSchema).aggregate([
            {
                "$match": {
                    customerId
                }
            },
            {
                "$addFields": {
                    "total": {
                        "$reduce": {
                            input: "$items",
                            initialValue: 0,
                            in: {
                                $add: ["$$value", "$$this.subtotal"]
                            }
                        }
                    }
                }
            }
        ])
        return found
    } catch (err) {
        console.log(err)
    }
}


module.exports.createCart = async function(customerId, itemId, qty, price, priceId) {
    try {
        const connection = await mongoConn()
        const Cart = await connection.model('Cart', CartSchema)

        const newCart = new Cart({
            customerId,
            items: [{
                id: itemId,
                qty,
                price,
                priceId,
                subtotal: price * qty
            }]
        })

        await newCart.save()

        return newCart
    } catch (err) {
        console.log(err)
    }
}

module.exports.addCart = async function(customerId, itemId, qty, price, priceId) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Cart', CartSchema).updateOne(
            {
                customerId,
            },
            {
                "$push": {
                    items: { id: itemId, qty, price, priceId, subtotal: price * qty }
                }
            }
        )

        return true
    } catch (err) {
        console.log(err)
    }
}

module.exports.updateCart = async function(customerId, itemId, qty, price) {
    try {
        const connection = await mongoConn()
        const res = await connection.model('Cart', CartSchema).updateOne(
            {
                customerId,
                "items.id": itemId
            },
            {
                "$set": {
                    "items.$.qty": qty,
                    "items.$.subtotal": qty * price
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


module.exports.createOrder = async function(orderObj) {
    try {
        const connection = await mongoConn()
        const Order = await connection.model('Order', OrderSchema)

        const newOrder = new Order({
            amount_total: orderObj.amount_total,
            customer: orderObj.customer,
            payment_intent: orderObj.payment_intent,
            payment_status: orderObj.payment_status
        })

        await newOrder.save()

        return newOrder
    } catch (err) {
        console.log(err)
    }
}

