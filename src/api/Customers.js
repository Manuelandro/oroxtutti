const Joi = require('joi')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const mongoConn = require('../mongo')
const { CustomerSchema } = require('../mongo/schemas')

const createCustomerValidator = Joi.object({
    email: Joi.string(),
    name: Joi.string(),
    phone: Joi.string(),
    shipping: Joi.object({
        address: Joi.object({
            city: Joi.string(),
            country: Joi.string(),
            line1: Joi.string(),
            line2: Joi.string().allow(''),
            postal_code: Joi.number(),
            state: Joi.string()
        }),
        name: Joi.string(),
        phone: Joi.string(),
    })
}).options({presence: 'required'});

module.exports.createCustomer = async (req, res) => {
    try {
        const { value, error } = createCustomerValidator.validate(req.body)
        if (error) {
            res.send(error)
            return
        }

        const connection = await mongoConn()
        const found = await connection.model('Customer', CustomerSchema).find({ email: req.body.email })
        if (found.length) {
            res.status(300).send({ message: 'User already exists '})
            return
        }

        const customer = await stripe.customers.create({
            ...value
         });
        res.send(customer)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}


module.exports.createCustomerLogin = async (req, res) => {
    try {
        const connection = await mongoConn()
        const Customer = await connection.model('Customer', CustomerSchema)
        const newCustomer = new Customer({
            id: req.body.id,
            email: req.body.email,
            password: req.body.password
        })
        await newCustomer.save()
        res.send(newCustomer)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}