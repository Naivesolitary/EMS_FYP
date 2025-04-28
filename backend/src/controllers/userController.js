const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const sendResponse = require('../utils/sendResponse')
const ApiError = require('../utils/ApiError')
require('dotenv').config();
const {saveUser,getUser,getAllUser, getUserByid,addToBlacklist,getBlacklist,cleanupExpiredTokens,verificationInfo}  = require('../models/userModel')
const {generateToken,generateRefreshToken} = require('../middlewares/jwtAuth')

const allUsers = asyncErrorHandler(async(req,res) => {
    const users = await getAllUser();
    if(!users) throw new ApiError(404,'Users not Found')
    sendResponse(res,{data:users})

    // res.json({users})


});
const createUser =  asyncErrorHandler(async (req,res) => {
   
        const user = req.body
        const {pdfPath} = req.body
        // const { name, email, password, phone, role } = req.body;
        console.log("sign up data: ",req.body)
        const saltsRound = 10; // Password hashing
        const hashedPassword = await bcrypt.hash(user.password,saltsRound)
        user.password = hashedPassword;
        const userData = await saveUser(user)
        const {id} = userData
        // console.log("ID ;;: " , id)
        if(!userData) throw new ApiError(500,'Signup failed')
        if(pdfPath){
            try{
               const result = await verificationInfo(id,pdfPath)
               console.log("PDF section result: ", result)

            }catch(err) {
                console.error("Error while publishing verification data: ", err)

            }
        }
        const payload = {id:userData.user_id,email: userData.email,role:userData.role}
        const accessToken = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 7 * 24 * 60* 1000 // 7 days in milliseconds
         })
        console.log('Generated Token Access Token: ', accessToken)
        console.log('Generated Token Refresh Token: ', refreshToken)
        sendResponse(res,{statusCode:201,data:{payload,tokens:{accessToken,refreshToken}},message:'User created Successfully'})

})

//     Refresh Token

const test = async(req,res) =>{

    const user_id = req.params.id
    const {pdfPath} = req.body
    const result = await verificationInfo(user_id,pdfPath)
    sendResponse(res,{data:result})
}

const newAccessToken = asyncErrorHandler(async(req,res) => {
   
    const refreshToken = req.cookies.refreshToken; // Get refresh token from HTTP-only cookie
    if (!refreshToken) throw new ApiError(401,'Refresh token not found!!')
    

    const isBlacklisted = await getBlacklist(refreshToken,'refresh');
    if(isBlacklisted)  throw new ApiError(403,'Refresh token has been revoked');

    
       
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);
      
        if(decoded.type !== 'refresh'){
            throw new ApiError(403,'Not a valid refresh token')
        }
     
        const payload = {
            id:decoded.id,
            email: decoded.email,
            role: decoded.role
        }
        const newAccessToken = generateToken(payload);

        sendResponse(res,{statusCode:201,data:{payload,newAccessToken},message:'new Access Token generated successfully'})
        
})


const viewProfile = asyncErrorHandler(async (req,res) => {
 
        const userData = req.decoded;
        console.log('User Data hi: ',userData)
        const user = await getUserByid(userData.user_id)
        if(!user) throw new ApiError(404,'User not found')
        sendResponse(res,{data:user})
 

})


/// this is for testing

const getUserById = asyncErrorHandler(async (req,res) => {
    // try{
        const user_id = req.params.id;
        console.log('User Data: ',user_id)
        const user = await getUserByid(user_id)
        if(!user) throw new ApiError(404,'User not Found')
        sendResponse(res,{data:user,message:'User info fetched successfully'})
    // }catch(error){
        // console.error('error while fetching: ', error)
        // res.status(505).json({message: 'fetching failed'})
// }
    

})




/// =============================


const verifyUser = asyncErrorHandler(async(req,res) => {


    const creds = req.body
     const user =  await getUser(creds)
     console.log("user info in user Controller", user)
     if(!user)  throw new ApiError(404,'User not found, create an account');
     const payload = {
        id: user.user_id,
        email: user.email,
        role: user.role
     }
     const accessToken = generateToken(payload);
     const refreshToken = generateRefreshToken(payload);

     res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        maxAge: 7 * 24 * 60 * 1000 // 7 days in milliseconds
     })
     sendResponse(res,{data:{payload,tokens:{accessToken,refreshToken}},message:'Login Successfully'})
      


})





const logout = asyncErrorHandler(async(req,res) => {

        const accessToken = req.token;
        const refreshToken = req.cookies.refreshToken


        // 1. Blacklist the access token
        if(accessToken){
            const decoded = jwt.decode(accessToken);

            if(!decoded || !decoded.exp){
                throw new ApiError(400,'Invalid Access token structure')
               
            }
            const expiryDate = new Date(decoded.exp * 1000); //Converted to milliseconds
            await addToBlacklist(accessToken,expiryDate)
            console.log('Access token blacklisted');
        }

        if(refreshToken){
            const decoded = jwt.decode(refreshToken);
            if (!decoded || !decoded.exp) {
                throw new ApiError(400,'Invalid Refresh token structure')
            }
            const expiryDate = new Date(decoded.exp * 1000);
            await addToBlacklist(refreshToken, expiryDate, 'refresh');
            await cleanupExpiredTokens()
            console.log('Refresh token blacklisted');
            res.clearCookie('refreshToken',{
            httpOnly:true,
            // secure: process.env.NODE_ENV === 'production', // Only use the cookie over HTTPS in production
            sameSite: 'Strict', // Helps mitigate CSRF
        })
        console.log('Refresh token cookie cleared');

       sendResponse(res,{message:'Logout Successfully'})
   
        }
})

module.exports = {
createUser, verifyUser,
allUsers,viewProfile,
 newAccessToken, logout,getUserById,test
}