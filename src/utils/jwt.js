const jwt = require('jsonwebtoken')

const JWT_SECRET = 'kasdbn19221312310edawqdq'

const generateToken = user => {
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' })
    return token
}
module.exports = {
    generateToken,
    JWT_SECRET
}