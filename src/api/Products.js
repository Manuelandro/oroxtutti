const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const retrieveProductsValidator = Joi.object({
    limit: Joi.number()
}).options({presence: 'required'});

module.exports.retrieveProducts = async (req, res) => {
    try {
        console.log(req.body)
        const { error } = retrieveProductsValidator.validate(req.body)
        if (error) {
            res.status(400).send({ error })
            return
        }
        const products = await stripe.products.list({ limit: req.body.limit });
        res.send({ products })
    } catch (err) {
        console.log(err)
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
            res.status(400).send({ error })
            return
        }
        const product = await stripe.products.retrieve(req.body.productId);
        const price = await stripe.prices.list({ product: req.body.productId })
        res.send({ ...product, price: price.data[0] })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
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
        console.log(err)
        res.status(400).send({ error: err.message })
    }
}


module.exports.retrievePrices = async (req, res) => {
    try {
        const prices = await stripe.prices.list()
        res.send({ prices: prices.data })
    } catch (err) {
        console.log(err)
        res.status(400).send({ error: err.message })
    }
}