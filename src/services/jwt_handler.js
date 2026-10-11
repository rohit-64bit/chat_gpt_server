const jwt = require('jsonwebtoken');

class JWTHandler {

    constructor({ clientID, userID, intentType }) {
        this.clientID = clientID;
        this.userID = userID;
        this.intentType = intentType;
    }

    generateToken() {

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        return jwt.sign({ ...this }, process.env.JWT_SECRET);

    }

    static verifyToken(token) {

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

}

module.exports = JWTHandler;