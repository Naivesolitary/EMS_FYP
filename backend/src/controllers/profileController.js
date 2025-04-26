const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/ApiError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const bcrypt = require('bcrypt')

const { updateUser, uploadProfileImage ,getUserInfo} = require("../models/profileModel");

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const userId = req.decoded.id;
  const { username, email, phone, password, profileImage } = req.body;
  const fieldsToUpdate = {};

  if (username) fieldsToUpdate.name = username;
  if (email) fieldsToUpdate.email = email;
  if (phone) fieldsToUpdate.phone = phone;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    fieldsToUpdate.password = hashedPassword;
  }

//   if (profileImage) fieldsToUpdate.profileImage = profileImage;

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new ApiError(400, { message: "No fields provided for update" });
  }

  await updateUser(userId, fieldsToUpdate);

  if (profileImage) {
    await uploadProfileImage(userId, profileImage);
  }

  sendResponse(res, { message: "Profile updated successfully" });
});


const userInfo = asyncErrorHandler(async(req,res,next) => {
   const userId = req.decoded.id;
   // console.log("user ID: ", userId)
   const info = await getUserInfo(userId)
   if(!info) throw new ApiError(404,"User info not found");
   sendResponse(res,{data:info,message:"Info fetched successfully!!"})
})


module.exports = {updateProfile,userInfo}

// import { updateUser, uploadProfileImage,getUserInfo } from "../models/profileModel";

// export const updateProfile = async (req,res) => {
//      try{
//         const userId = req.decoded.id;
//         const {name, email, phone, password} = req

//      }catch(err) {
//         console.log("Error while updating profile: ",err)
//      }
// }

// const viewProfile = async(req,res) => {
//     const  user_id = 34
//     const result = await getUserInfo(user_id)
//     console.log(result)
//     res.ok(200).json({result})
// }
