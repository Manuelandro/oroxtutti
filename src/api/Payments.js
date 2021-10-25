
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const verifyToken = require('../jwt/verifyToken')
const { getCart } = require('../mongo/queries')

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