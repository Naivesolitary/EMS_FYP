const sendResponse = (res, {statusCode = 200, success = true, data = null, message = ''}) => {
    res.status(statusCode).json({
        success,
        message,
        data,
    })
}

module.exports = sendResponse;