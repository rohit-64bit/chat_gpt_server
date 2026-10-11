const UserModel = require("../models/user.model")
const JWTHandler = require("../services/jwt_handler")

const authMiddleware = async (req, res, next) => {

    try {

        const token = req.headers.authorization?.split(' ')[1]

        console.log(token)

        if (!token) {
            throw new Error('Invalid Auth 1')
        }

        const decoded = JWTHandler.verifyToken(token)

        if (!decoded) {
            throw new Error('Invalid Auth 2')
        }

        if (decoded.intentType !== 'session') {
            throw new Error('Invalid Auth 3')
        }

        req.user = await UserModel.findById(decoded.userID)

        if (!req.user) {
            throw new Error('Invalid Auth 4')
        }

        next()

    } catch (error) {
        throw new Error('Authentication failed');
    }

}

module.exports = authMiddleware