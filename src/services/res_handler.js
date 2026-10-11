class ResponseHandler {

    static sendSuccess(res, data, message, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data
        })
    }

    static sendError(res, error, message, statusCode = 500) {

        console.error(error);

        return res.status(statusCode).json({
            status: 'error',
            message,
            error
        })

    }

}

module.exports = ResponseHandler;