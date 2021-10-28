const verifyToken = require('../../jwt/verifyToken')
const { getCart } = require('../../mongo/queries')
const { getCustomerExists } = require('../../mongo/queries')

module.exports = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const [customer] = await getCustomerExists(payload.data.email)
        if (!customer) {
            res.status(300).send({ error: 'User not exists'})
            return
        }
        const [cart] = await getCart(payload.data.id)
        if (!cart) {
            res.send({ cart: {} })
            return
        }

        res.send({ cart })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}