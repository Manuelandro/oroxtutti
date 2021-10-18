const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const verifyToken = require('../../jwt/verifyToken')
const { getCart, createCart, addCart } = require('../../mongo/queries')

const addToCartValidator = Joi.object({
    token: Joi.string(),
    itemId: Joi.string(),
    qty: Joi.number()
}).options({presence: 'required'});

module.exports = async (req, res) => {
    try {
        const { error } = addToCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const { token, itemId, qty } = req.body
        const auth = await verifyToken(token)

        const prices = await stripe.prices.list({ product: itemId })
        const price = prices.data[0]?.unit_amount

        const [cart] = await getCart(auth.data.id)
        if (!cart) {
            await createCart(auth.data.id, itemId, qty, price)
        } else {
            await addCart(auth.data.id, itemId, qty, price)
        }

        const [cart2] = await getCart(auth.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}
