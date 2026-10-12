const { Schema, model } = require('mongoose')
const { SchemaOptions } = require('../configs/db')
const PasswordHandler = require('../services/pass_handler')
const JWTHandler = require('../services/jwt_handler')
const OtpModel = require('./otp.model')
const otpGenerator = require('otp-generator')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isAuth: {
        type: Boolean,
        default: false
    }
}, SchemaOptions)

UserSchema.pre('save', async function (error, doc, next) {

    if (this.isNew) {

        if (error.name === 'MongoServerError' && error.code === 11000) {

            throw new Error(`User Already Exists`)

        }

        const prevPass = this.password

        this.password = await PasswordHandler.hashPassword(prevPass)

    }

})

UserSchema.methods.signin = async function (password) {

    if (!this.isAuth){
        throw new Error('User is not verified, please verify your email')
    }

    const isMatch = PasswordHandler.comparePassword(password, this.password)

    return isMatch

}

UserSchema.methods.generateToken = async function (clientID, intentType) {

    const token = new JWTHandler({ clientID: clientID, userID: this._id, intentType }).generateToken()

    return token

}

UserSchema.methods.generateOTP = async function (intentType) {

    const otp = new OtpModel({
        otp: otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }),
        userID: this._id,
        type: intentType
    })

    console.log(otp)

    await otp.save()

    //TOTO: Send OTP to user via email or SMS

    return

}

UserSchema.methods.verifyOTP = async function (otp) {

    const otpRecord = await OtpModel.findOne({ userID: this._id, otp: otp })

    otpRecord.isVerified = true

    await otpRecord.save()

    // udpate the user isauth flag to true

    this.isAuth = true

    await this.save()

    return true

}

const UserModel = model('user', UserSchema)

module.exports = UserModel