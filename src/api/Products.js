const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const retrieveProductsValidator = Joi.object({
    limit: Joi.number()
}).options({presence: 'required'});

module.exports.retrieveProducts = async (req, res) => {
    try {
        const { error } = retrieveProductsValidator.validate(req.body)
        if (error) {
            res.send(error)
            return
        }
        const products = await stripe.products.list({ limit: req.body.limit });
        res.send(products)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}

const retrieveProductValidator = Joi.object({
    productId: Joi.string()
}).options({presence: 'required'});


module.exports.retrieveProduct = async (req, res) => {
    try {
        const { error } = retrieveProductValidator.validate(req.body)
        if (error) {
            res.send(error)
            return
        }
        const product = await stripe.products.retrieve(req.body.productId);
        res.send(product)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}