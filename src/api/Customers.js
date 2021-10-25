const Joi = require('joi')
const md5 = require('md5')
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { getCustomerExists, getCustomerLogin, updateCustomer, setCustomer } = require('../mongo/queries')
const createToken = require('../jwt/createToken')
const verifyToken = require('../jwt/verifyToken')

const createCustomerValidator = Joi.object({
    email: Joi.string(),
    password: Joi.string()
}).options({presence: 'required'});


module.exports.createCustomer = async (req, res) => {
    try {
        const { value, error } = createCustomerValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }

        const found = await getCustomerExists(req.body.email)
        if (found.length) {
            res.status(300).send({ error: 'User already exists '})
            return
        }

        const customerStripe = await stripe.customers.create({
            email: req.body.email
         });


        const hashPwd = md5(value.password)
        await setCustomer({ email: value.email, password: hashPwd, id: customerStripe.id })
        const token = await createToken({ email: value.email, id: customerStripe.id })

        res.send({ token })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}


const updateCustomerValidator = Joi.object({
    id: Joi.string(),
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


module.exports.updateCustomer = async (req, res) => {
    try {
        const { value, error } = updateCustomerValidator.validate(req.body)
        if (error) {
            res.status(300).send({ error })
            return
        }


    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
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
            res.status(300).send({ error })
            return
        }
        const { email, password } = req.body
        const hashPwd = md5(password)
        const found = await getCustomerLogin(email, hashPwd)
        if (!found.length) {
            res.status(300).send({ error: 'Incorrect fields'})
            return
        }

        const token = await createToken({ email, id: found[0].id })
        res.send({ token })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}




module.exports.customerInfo = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const [customer] = await getCustomerExists(payload.data.email)
        if (!customer) {
            res.status(300).send({ error: 'User not exists'})
            return
        }


        const customerStripe = await stripe.customers.retrieve(payload.data.id)

        res.send({  ...customerStripe })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}