const authMiddleware = require('../middlewares/auth.middleware');
const resetMiddleware = require('../middlewares/reset.middleware');
const UserModel = require('../models/user.model');
const ResponseHandler = require('../services/res_handler');

const router = require('express').Router();


router.post('/auth/login', async (req, res) => {

    try {

        const {
            email, password
        } = req.body;

        // Perform login logic here
        const user = await UserModel.findOne({ email })

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if the password is correct
        const isMatch = await user.signin(password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = await user.generateToken('clientID', 'session');

        ResponseHandler.sendSuccess(res, { token }, 'Login successful');

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 401);

    }

})

router.post('/auth/register', async (req, res) => {

    try {

        const {
            email, password
        } = req.body;

        const user = await UserModel.create({ email, password });

        const token = await user.generateToken('clientID', 'reset');

        await user.generateOTP('verify');

        ResponseHandler.sendSuccess(res, { token, redirect: "auth-verify" }, 'Account created please verify your email', 201);

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.post('/auth/verify', resetMiddleware, async (req, res) => {

    try {

        const { otp } = req.body;

        const user = req.user;

        const isVerified = await user.verifyOTP(otp);

        if (!isVerified) {
            throw new Error('Invalid OTP');
        }

        const token = await user.generateToken('clientID', 'session');

        ResponseHandler.sendSuccess(res, { user, token }, 'Email Verified');

    } catch (error) {

        ResponseHandler.sendError(res, error.message, 400);

    }

})

router.get('/me', authMiddleware, async (req, res) => {

    try {

        const user = req.user;

        user.password = undefined;

        ResponseHandler.sendSuccess(res, { user }, 'User fetched successfully');

    } catch (error) {
        ResponseHandler.sendError(res, error.message, 400);
    }

})


module.exports = router;