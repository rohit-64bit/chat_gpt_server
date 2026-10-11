const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')

const MessageSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    chatID: {
        type: Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    projectID: {
        type: Schema.Types.ObjectId,
        ref: 'project',
    },
    message: {
        type: String,
    },
    agent: {
        type: String,
        enum: ['user', 'bot', 'system'],
    },
    sessionID: {
        type: Schema.Types.ObjectId,
        ref: 'session',
    },
}, SchemaOptions)

const MessageModel = model('message', MessageSchema)

module.exports = MessageModel