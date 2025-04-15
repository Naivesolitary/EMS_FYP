const jwt = require('jsonwebtoken');
const {getBlacklist} = require('../models/userModel')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const ApiError = require('../utils/ApiError')
require('dotenv').config()
const jwtAuth = asyncErrorHandler(async(req,res,next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) throw new ApiError(401,'Token missing');
   
        console.log(token)
        const blacklist = await getBlacklist(token);
      
        if(blacklist) throw new ApiError(403,'Token has been revoked');
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         if(!decoded) throw new ApiError(401,'Invalid token')
         req.token = token;
         req.decoded = decoded
         next()

   

})


// generate jwt token [Access Token]
const generateToken = (payload) => {

    // Generate new Jwt token using the payload or user data
     return jwt.sign({...payload,type:'access'},process.env.JWT_SECRET,{expiresIn: '2m'})
}


// generate jwt token [Refresh token]

const generateRefreshToken = (payload) => {

    return jwt.sign({...payload,type:'refresh'},process.env.JWT_SECRET,{expiresIn:'7d'})
}



module.exports = {jwtAuth ,generateToken,generateRefreshToken};