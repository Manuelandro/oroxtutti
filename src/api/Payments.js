
// Specify Stripe secret api key here
const Joi = require('joi')
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const logger = require('../loggger')
const verifyToken = require('../jwt/verifyToken')
const { getCart, deleteCart, createOrder } = require('../mongo/queries')
const { sendMailOrder } = require('../mail/index')


module.exports.createSession = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const [cart] = await getCart(payload.data.id)
        if (!cart) {
            logger.child({ ctx: req.headers }).warn("Cart not found")
            res.status(400).send({ error: "Cart not found" })
            return
        }

        const customerStripe = await stripe.customers.retrieve(payload.data.id)
        const session = await stripe.checkout.sessions.create({
            customer: customerStripe.id,
            submit_type: 'pay',
            billing_address_collection: 'auto',
            line_items: cart.items.map(item => ({
                price: item.priceId,
                quantity: item.qty
            })),
            payment_method_types: ['card', 'alipay', 'giropay', 'klarna', 'sepa_debit', 'sofort'],
            mode: 'payment',
            success_url: `${process.env.REDIRECT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.REDIRECT_URL}/cancel`
        })

        await createOrder(session, cart.items, customerStripe.shipping)
        await deleteCart(customerStripe.id)
        res.send({ session })

    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}

const retrieveSessionValidator = Joi.object({
    sessionId: Joi.string()
}).options({presence: 'required'});


module.exports.retrieveSession = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const { value, error } = retrieveSessionValidator.validate(req.body)
        if (error) {
            logger.child({ ctx: req.body }).warn(error)
            res.status(400).send({ error })
            return
        }

        const session = await stripe.checkout.sessions.retrieve(req.body.sessionId);
        res.send({ ...session })
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}


module.exports.fulfillOrder = async (req, res) => {
    try {
        const event = req.body

        logger.info(event)

        switch (event.type) {
            case 'payment_intent.succeded':
                const paymentIntent = event.data.object
                await sendMailOrder(paymentIntent)
                break
            case 'payment_intent.canceled':
                // @todo update order
                break
            case 'payment_intent.payment_failed':
            case 'checkout.session.completed':
            case 'charge.succeeded':
                break
            default:
                //@ todo logger
                break
        }

        res.send()
    } catch (err) {
        logger.child({ ctx: req.body }).error(err.message)
        res.status(400).send({ error: err.message })
    }
}