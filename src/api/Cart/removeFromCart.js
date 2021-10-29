const Joi = require('joi')
const verifyToken = require('../../jwt/verifyToken')
const { getCart, removeFromCart } = require('../../mongo/queries')


const removeFromCartValidator = Joi.object({
    productId: Joi.string()
}).options({presence: 'required'});

module.exports = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const { error } = removeFromCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        await removeFromCart(payload.data.id, req.body.productId)

        const [cart2] = await getCart(payload.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}
