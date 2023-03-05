const crypto = require('crypto')

exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
}

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err)
            const buffString = buff.toString('hex')

            console.log(buffString)
            resolve(buffString)
        })
    })
}

// if it dint match any matching route in the client side we will send this error
exports.handleNotFound = (req, res) => {
    this.sendError(res, 'Not found, 404')
}