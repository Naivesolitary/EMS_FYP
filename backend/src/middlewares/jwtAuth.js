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
        try{
         const  decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.token = token;
            req.decoded = decoded
            next()
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                throw new ApiError(401,'Access token expired');
            }
            throw new ApiError(401,'Invalid token')
        }   
    
        

   

})


// generate jwt token [Access Token]
const generateToken = (payload) => {

    // Generate new Jwt token using the payload or user data
     return jwt.sign({...payload,type:'access'},process.env.JWT_SECRET,{expiresIn: '30s'})
}


// generate jwt token [Refresh token]

const generateRefreshToken = (payload) => {

    return jwt.sign({...payload,type:'refresh'},process.env.JWT_SECRET,{expiresIn:'7d'})
}



module.exports = {jwtAuth ,generateToken,generateRefreshToken};