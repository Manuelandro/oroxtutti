const Joi = require('joi')
const verifyToken = require('../../jwt/verifyToken')
const { getCart, removeFromCart } = require('../../mongo/queries')


const removeFromCartValidator = Joi.object({
    token: Joi.string(),
    itemId: Joi.string()
}).options({presence: 'required'});

module.exports = async (req, res) => {
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
