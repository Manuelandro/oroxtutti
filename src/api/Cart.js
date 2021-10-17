const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const verifyToken = require('../jwt/verifyToken')
const { getCart, createCart, updateCart, removeFromCart } = require('../mongo/queries')

const retrieveCartValidator = Joi.object({
    token: Joi.string(),
}).options({presence: 'required'});

module.exports.retrieveCart = async (req, res) => {
    try {
        const { error } = retrieveCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const auth = await verifyToken(req.body.token)
        const [cart = {}] = await getCart(auth.data.id)
        res.send({ cart })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}

const addToCartValidator = Joi.object({
    token: Joi.string(),
    itemId: Joi.string(),
    qty: Joi.number()
}).options({presence: 'required'});

module.exports.addToCart = async (req, res) => {
    try {
        const { error } = addToCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const auth = await verifyToken(req.body.token)
        const [cart] = await getCart(auth.data.id)
        if (!cart) {
            await createCart(auth.data.id, req.body.itemId, req.body.qty)
        } else {
            await updateCart(auth.data.id, [...cart.items, { id: req.body.iemId, qty: req.body.qty }])
        }

        const [cart2] = await getCart(auth.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}


const removeFromCartValidator = Joi.object({
    token: Joi.string(),
    itemId: Joi.string()
}).options({presence: 'required'});

module.exports.removeFromCart = async (req, res) => {
    try {
        const { error } = removeFromCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const auth = await verifyToken(req.body.token)
        await removeFromCart(auth.data.id, req.body.itemId)

        const [cart2] = await getCart(auth.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}

const updateQtyInCartValidator = Joi.object({
    token: Joi.string(),
    itemId: Joi.string(),
    qty: Joi.number()
}).options({presence: 'required'});

module.exports.updateQtyInCart = async (req, res) => {
    try {
        const { error } = updateQtyInCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const auth = await verifyToken(req.body.token)
        await updateCart(auth.data.id, req.body.itemId, req.body.qty)
        const [cart2] = await getCart(auth.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}