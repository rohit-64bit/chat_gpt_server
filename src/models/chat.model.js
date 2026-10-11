const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')

const ChatSchema = new Schema({
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title:{
        type: String,
    },
    context:{
        type: String,
    },
    projectID:{
        type: Schema.Types.ObjectId,
        ref: 'project',
    },
    markedDeleted: {
        type: Boolean,
        default: false
    }
}, SchemaOptions)


const ChatModel = model('chat', ChatSchema)

module.exports = ChatModel