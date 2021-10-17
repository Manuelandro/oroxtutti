const jwt = require('jsonwebtoken')

module.exports = function(token = '') {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, auth) => {
            if (err) {
                reject(err)
                return
            }

            resolve(auth)
        })
    })
}