const nodemailer = require('nodemailer')


module.exports.sendMailOrder = async function(paymentIntent = {}) {
    let transporter = nodemailer.createTransport({
        host: "smtps.aruba.it",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER, // generated ethereal user
          pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"ORO X TUTTI" <postmaster@oroxtutti.it>', // sender address
        to: "mpalma.job@gmail.com", // list of receivers
        subject: "Nuovo Ordine", // Subject line
        text: `Ué anto' c'è un nuovo ordine nella dashboard, vir è di ${paymentIntent.amount / 100} €. Bucchì stai a fa e sorddddd!`
    });
}