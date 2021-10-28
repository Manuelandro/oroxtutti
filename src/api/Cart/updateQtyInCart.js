const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const verifyToken = require('../../jwt/verifyToken')
const { getCart, updateCart } = require('../../mongo/queries')


const updateQtyInCartValidator = Joi.object({
    productId: Joi.string(),
    qty: Joi.number()
}).options({presence: 'required'});

module.exports = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)


        const { error } = updateQtyInCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const { productId, qty } = req.body
        const prices = await stripe.prices.list({ product: productId })
        const price = prices.data[0]?.unit_amount


        await updateCart(payload.data.id, productId, qty, price)

        const [cart2] = await getCart(payload.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}