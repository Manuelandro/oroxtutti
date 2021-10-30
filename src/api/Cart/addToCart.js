const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const logger = require('../../loggger')
const verifyToken = require('../../jwt/verifyToken')
const { getCart, createCart, addCart } = require('../../mongo/queries')

const addToCartValidator = Joi.object({
    productId: Joi.string(),
    qty: Joi.number()
}).options({presence: 'required'});

module.exports = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const { error } = addToCartValidator.validate(req.body)
        if (error) {
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }

        const { productId, qty } = req.body

        const prices = await stripe.prices.list({ product: productId })
        const price = prices.data[0]?.unit_amount
        const priceId = prices.data[0]?.id

        const [cart] = await getCart(payload.data.id)
        if (!cart) {
            await createCart(payload.data.id, productId, qty, price, priceId)
        } else {
            await addCart(payload.data.id, productId, qty, price, priceId)
        }

        const [cart2] = await getCart(payload.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}
