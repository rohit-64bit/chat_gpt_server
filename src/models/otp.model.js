const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')
const { OTP_TYPES } = require('../configs/commons')

const OtpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: OTP_TYPES
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300 // 5 minutes
    }
}, SchemaOptions)


const OtpModel = model('otp', OtpSchema)

module.exports = OtpModel