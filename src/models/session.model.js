const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')

const SessionSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    clientID: {
        type: String,
    },
    clientInfo: {
        os: {
            type: String,
        },
        clientType: {
            type: String,
        },
        ipAddress: {
            type: String,
        }
    }
}, SchemaOptions)

const SessionModel = model('session', SessionSchema)

module.exports = SessionModel