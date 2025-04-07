const jwt = require('jsonwebtoken');
const {getBlacklist} = require('../models/userModel')
require('dotenv').config()
const jwtAuth = async(req,res,next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) res.status(401).json({ message: 'Token missing' });
    try{
        console.log(token)
        const blacklist = await getBlacklist(token);
        if(blacklist) return res.status(403).json({ message: 'Token has been revoked' });
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         req.token = token;
         req.decoded = decoded
         next()

    }catch(error){
        return res.status(401).json({ message: 'Invalid token' });

    }

}


// generate jwt token [Access Token]
const generateToken = (payload) => {

    // Generate new Jwt token using the payload or user data
     return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '7m'})
}


// generate jwt token [Refresh token]

const generateRefreshToken = (payload) => {

    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})
}



module.exports = {jwtAuth ,generateToken,generateRefreshToken};