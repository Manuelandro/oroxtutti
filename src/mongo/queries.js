const mongoConn = require('./connection')
const { CustomerSchema, CartSchema, OrderSchema } = require('./schemas')

/**
 *  CUSTOMER
 */
module.exports.getCustomerExists = async function(email = '') {
    const connection = await mongoConn()
    const found = await connection.model('Customer', CustomerSchema).find({ email })

    return found
}

module.exports.getCustomerLogin = async function(email = '', password = '') {
    const connection = await mongoConn()
    const found = await connection.model('Customer', CustomerSchema).find({ email, password })
    return found
}

module.exports.updateCustomer = async function({ email, ...rest }) {
    const connection = await mongoConn()
    const res = await connection.model('Customer', CustomerSchema).updateOne(
        { email: email }, { ...rest }
    )
    if (!res.modifiedCount) {
        throw new Error("No customers matched")
    }
    return true
}

module.exports.setCustomer = async function(values = {}) {
    const connection = await mongoConn()
    const Customer = await connection.model('Customer', CustomerSchema)

    const newCustomer = new Customer({
        ...values
    })
    await newCustomer.save()

    return newCustomer
}


/**
 * CART
 */

module.exports.getCart = async function(customerId) {
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
}


module.exports.createCart = async function(customerId, itemId, qty, price, priceId) {
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
}

module.exports.addCart = async function(customerId, itemId, qty, price, priceId) {
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
}

module.exports.updateCart = async function(customerId, itemId, qty, price) {
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
}

module.exports.removeFromCart = async function(customerId, itemId) {
    const connection = await mongoConn()
    const res = await connection.model('Cart', CartSchema).updateOne({
        customerId,
    }, {
        "$pull": {
            "items": { id: itemId }
        }
    })
    return res
}


module.exports.deleteCart = async function(customerId) {
    const connection = await mongoConn()
    const res = await connection.model('Cart', CartSchema).deleteOne({ customerId })
    return res
}


module.exports.createOrder = async function(orderObj, items, shipping) {
    const connection = await mongoConn()
    const Order = await connection.model('Order', OrderSchema)

    const newOrder = new Order({
        amount_total: orderObj.amount_total,
        customer: orderObj.customer,
        items,
        payment_intent: orderObj.payment_intent,
        payment_status: orderObj.payment_status,
        shipping
    })

    await newOrder.save()

    return newOrder
}

module.exports.getOrder = async function(payment_intent, customer) {
    const connection = await mongoConn()
    const found = await connection.model('Order', OrderSchema).find({ payment_intent, customer })

    return found
}

