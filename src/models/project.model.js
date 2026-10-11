const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    detail: {
        type: String,
    },
    context: {
        type: String,
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    markedDeleted: {
        type: Boolean,
        default: false
    }
}, SchemaOptions)

const ProjectModel = model('project', ProjectSchema)

module.exports = ProjectModel