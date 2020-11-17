const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(400).json({message: "No authorization"})
        }

        const verify = jwt.verify(token, config.get("jwtSecretKey"))
        req.user = verify
        next()
    }catch (err) {
        res.status(400).json({err: err.message, message: 'No authorization'})
    }
}