const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const retrieveCartValidator = Joi.object({
    customerId: Joi.string(),
    token: Joi.string(),
}).options({presence: 'required'});

module.exports.retrieveCart = async (req, res) => {
    try {
        const { error } = retrieveCartValidator.validate(req.body)
        if (error) {
            res.send(error)
            return
        }

    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}