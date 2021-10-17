const jwt = require('jsonwebtoken')

module.exports = function(data = {}) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, process.env.JWT_SECRET, (err, token) => {
            if (err) {
                reject(err)
                return
            }

            resolve(token)
        })
    })
}