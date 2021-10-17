
// Specify Stripe secret api key here
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports.createPaymentIntent = async (req, res) => {

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'eur',
        })

        res.send({ paymentIntent })
    } catch (err) {
        console.log(err)
        res.status(300).send({ error: err.message })
    }
}