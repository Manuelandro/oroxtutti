const Joi = require('joi')
const verifyToken = require('../../jwt/verifyToken')
const { getCart } = require('../../mongo/queries')


const retrieveCartValidator = Joi.object({
    token: Joi.string(),
}).options({presence: 'required'});

module.exports = async (req, res) => {
    try {
        const { error } = retrieveCartValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const auth = await verifyToken(req.body.token)
        const [cart] = await getCart(auth.data.id)
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