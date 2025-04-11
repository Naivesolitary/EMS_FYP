class ApiError extends Error{
    constructor(statusCode,message = 'Something went wrong',stack=''){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Distinguish operational erros
        Error.captureStackTrace(this,this.constructor);

       

    }
}

module.exports = ApiError;