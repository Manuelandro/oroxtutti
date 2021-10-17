const Joi = require('joi')
const md5 = require('md5')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { getCustomerExists, getCustomerLogin, updateCustomer, setCustomer } = require('../mongo/queries')
const createToken = require('../jwt/createToken')

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
            res.status(300).send(error)
            return
        }

        const found = await getCustomerExists(req.body.email)
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
        res.status(300).send(err.message)
    }
}


const createCustomerLoginValidator = Joi.object({
    id: Joi.string(),
    email: Joi.string(),
    password: Joi.string()
}).options({presence: 'required'});


module.exports.createCustomerLogin = async (req, res) => {
    try {
        const { error } = createCustomerLoginValidator.validate(req.body)
        if (error) {
            res.status(300).send(error)
            return
        }
        const { email, password, id } = req.body
        const hashPwd = md5(password)
        const newCustomer = await setCustomer({ email, password: hashPwd, id })
        res.send(newCustomer)
    } catch (err) {
        console.log(err)
        res.status(300).send(err.message)
    }
}


const customerLoginValidator = Joi.object({
    email: Joi.string(),
    password: Joi.string()
}).options({presence: 'required'});

module.exports.customerLogin = async (req, res) => {
    try {
        const { error } = customerLoginValidator.validate(req.body)
        if (error) {
            res.send(error)
            return
        }
        const { email, password } = req.body
        const hashPwd = md5(password)
        const found = await getCustomerLogin(email, hashPwd)
        if (!found.length) {
            res.status(300).send({ message: 'Incorrect fields'})
            return
        }

        const token = await createToken({ email, password: hashPwd })
        const result = await updateCustomer({ email, token })
        if (!result) {
            res.status(300).send({ error: "no token created"})
            return
        }
        res.send({ token })
    } catch (err) {
        console.log(err)
        res.status(300).send(err.message)
    }
}