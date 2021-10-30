const Joi = require('joi')
const logger = require('../../loggger')
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
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }

        await removeFromCart(payload.data.id, req.body.productId)

        const [cart2] = await getCart(payload.data.id)
        res.send({ cart: cart2 })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}
