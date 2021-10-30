
// Specify Stripe secret api key here
const Joi = require('joi')
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const verifyToken = require('../jwt/verifyToken')
const { getCart, createOrder } = require('../mongo/queries')
const { sendMailOrder } = require('../mail/index')


module.exports.createPaymentMethod = async (req, res) => {
    try {
        const { token } = req.body
        const auth = await verifyToken(token)

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: '4242424242424242',
              exp_month: 10,
              exp_year: 2022,
              cvc: '314',
            },
        })

        res.send({ paymentMethod })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}

module.exports.createPaymentIntent = async (req, res) => {
    try {
        const { token } = req.body
        const auth = await verifyToken(token)
        const [cart] = await getCart(auth.data.id)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: cart.total,
            currency: 'eur',
            payment_method_types: [
                "giropay",
                "pes",
                "p24",
                "sofort",
                "sepa_debit",
                "card"
            ]
        })

        res.send({ paymentIntent })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}


module.exports.createSession = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1] || ''
        const payload = await verifyToken(token)

        const [cart] = await getCart(payload.data.id)
        if (!cart) {
            res.status(300).send({ error: "Cart not found" })
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
            success_url: `${process.env.REDIRECT_URL}/success`,
            cancel_url: `${process.env.REDIRECT_URL}/cancel`
        })

        await createOrder(session)
        res.send({ session })

    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}


module.exports.fulfillOrder = async (req, res) => {
    try {
        const event = req.body
        switch (event.type) {
            case 'payment_intent.created':
                // @todo create order
                break
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
        console.log(err)
        res.status(400).send({ error: err.message })
    }
}