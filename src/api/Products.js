const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const logger = require('../loggger')

const retrieveProductsValidator = Joi.object({
    limit: Joi.number()
}).options({presence: 'required'});

module.exports.retrieveProducts = async (req, res) => {
    try {
        const { error } = retrieveProductsValidator.validate(req.body)
        if (error) {
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }
        const products = await stripe.products.list({ limit: req.body.limit });
        res.send({ products })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}

const retrieveProductValidator = Joi.object({
    productId: Joi.string()
}).options({presence: 'required'});


module.exports.retrieveProduct = async (req, res) => {
    try {
        const { error } = retrieveProductValidator.validate(req.body)
        if (error) {
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }
        const product = await stripe.products.retrieve(req.body.productId);
        const price = await stripe.prices.list({ product: req.body.productId })
        res.send({ ...product, price: price.data[0] })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}


module.exports.retrieveSinglePrice = async (req, res) => {
    try {
        const price = await stripe.prices.list({
            product: req.body.productId,
            active: true
        })
        res.send({ price })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}


module.exports.retrievePrices = async (req, res) => {
    try {
        const prices = await stripe.prices.list()
        res.send({ prices: prices.data })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}