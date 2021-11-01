const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const logger = require('../loggger')
const verifyToken = require('../jwt/verifyToken')
const { getOrder } = require('../mongo/queries')

module.exports.getOrders = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const customer = await stripe.customers.retrieve(payload.data.id)
        if (!customer) {
            logger.child({ ctx: req.body }).warn("User not exists")
            res.status(300).send({ error: 'User not exists'})
            return
        }


        const orders = await stripe.paymentIntents.list({
            customer: customer.id
        });

        res.send({  ...orders })
    } catch (err) {
        logger.child({ ctx: req.headers }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}


const getOrderValidator = Joi.object({
    paymentIntent: Joi.string()
}).options({presence: 'required'});


module.exports.getOrder = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const { value, error } = getOrderValidator.validate(req.body)
        if (error) {
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }


        const customer = await stripe.customers.retrieve(payload.data.id)
        if (!customer) {
            logger.child({ ctx: value }).warn("User not exists")
            res.status(300).send({ error: 'User not exists'})
            return
        }

        const order = await getOrder(value.paymentIntent, customer.id)

        res.send({  ...order })
    } catch (err) {
        logger.child({ ctx: req.headers }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}