const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {saveUser,getUser,getAllUser, getUserByid,addToBlacklist,getBlacklist}  = require('../models/userModel')
const {generateToken,generateRefreshToken} = require('../middlewares/jwt')

const allUsers = async(req,res) => {
    const users = await getAllUser();
    res.json({users})


}
const createUser = async (req,res) => {
    try{

        const user = req.body;
        const saltsRound = 10; // Password hashing
        const hashedPassword = await bcrypt.hash(user.password,saltsRound)
        user.password = hashedPassword;
        const msg = await saveUser(user)
        const payload = {id:msg.id,email: msg.email,role:msg.role}
        const token = generateToken(payload)
        console.log('Generated Token: ', token)
        res.json({msg,token})
    }catch(error){
        console.error('error while saving user data: ', error)
        res.status(505).json({message: 'sign up failed'})
    }




}

//     Refresh Token

const refreshToken = async(req,res) => {
   
    const refreshToken = req.cookies.refreshToken; // Get refresh token from HTTP-only cookie
    if (!refreshToken){
        return  res.status(401).json({error:'Refresh token not found!!'})
    }

    const isBlacklisted = await getBlacklist(refreshToken,'refresh');
    if(isBlacklisted)  return res.status(403).json({ message: 'Refresh token has been revoked' });

    try{


        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);

        const newAccessToken = generateToken({
            id:decoded.id,
            email: decoded.email,
            role: decoded.role
        });

        res.json({accessToken:newAccessToken})
    }catch(error){
        console.error(error);
        return res.status(403).json({ error: 'Invalid refresh token' });

    }

    


}

const viewProfile = async (req,res) => {
    try{
        const userData = req.decoded;
        console.log('User Data: ',userData)
        const user = await getUserByid(userData.id)
        res.json({user})
    }catch(error){
        console.error('error while fetching: ', error)
        res.status(505).json({message: 'fetching failed'})
    }

}

const verifyUser = async(req,res) => {

    try{
    const creds = req.body
     const user =  await getUser(creds)
     if(!user)  return res.status(401).json({ message: 'Invalid Credentials' });
     const payload = {
        id: user.id,
        email: user.email,
        role: user.role
     }
     const accessToken = generateToken(payload);
     const refreshToken = generateRefreshToken(payload);

     res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge: 7 * 24 * 60* 1000 // 7 days in milliseconds
     })
     res.json({accessToken,refreshToken})
    } catch(error){
        console.error('Error: ', error)
        res.status(500).json({error: 'Internal Server Error'})
    }
    
    


}





const logout = async(req,res) => {
    try{
        const accessToken = req.token;
        const refreshToken = req.cookies.refreshToken


        // 1. Blacklist the access token
        if(accessToken){
            const decoded = jwt.decode(accessToken);

            if(!decoded || !decoded.exp){
                return res.status(400).json({ message: 'Invalid token structure' });
            }
            const expiryDate = new Date(decoded.exp * 1000); //Converted to milliseconds
            await addToBlacklist(accessToken,expiryDate)
            console.log('Access token blacklisted');
        }

        if(refreshToken){
            const decoded = jwt.decode(refreshToken);
            if (!decoded || !decoded.exp) {
                return res.status(400).json({ message: 'Invalid refresh token structure' });
            }
            const expiryDate = new Date(decoded.exp * 1000);
            await addToBlacklist(refreshToken, expiryDate, 'refresh');
            console.log('Refresh token blacklisted');
            res.clearCookie('refreshToken',{
            httpOnly:true,
            // secure: process.env.NODE_ENV === 'production', // Only use the cookie over HTTPS in production
            sameSite: 'Strict', // Helps mitigate CSRF
        })
        console.log('Refresh token cookie cleared');


       return res.status(200).json({message:'Logout Successfully'})
    }

    }catch(error){
        console.error('Logout Error: ', error);
        res.status(500).json({ message: 'Something went wrong during logout' });

    }

}

module.exports = {
createUser, verifyUser,
allUsers,viewProfile,
 refreshToken, logout
}