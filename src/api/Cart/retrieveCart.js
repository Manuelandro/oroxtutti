const logger = require('../../loggger')
const verifyToken = require('../../jwt/verifyToken')
const { getCart } = require('../../mongo/queries')
const { getCustomerExists } = require('../../mongo/queries')

module.exports = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const [customer] = await getCustomerExists(payload.data.email)
        if (!customer) {
            logger.child({ ctx: req.body }).warn("User not exists")
            res.status(400).send({ error: 'User not exists'})
            return
        }
        const [cart] = await getCart(payload.data.id)
        if (!cart) {
            res.send({ cart: {} })
            return
        }

        res.send({ cart })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}