const jwt = require('jsonwebtoken')

module.exports = function(data = {}) {
    return new Promise((resolve, reject) => {
        jwt.sign({ data, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) }, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                reject(err)
                return
            }

            resolve(token)
        })
    })
}