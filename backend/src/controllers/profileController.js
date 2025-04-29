const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/ApiError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const bcrypt = require('bcrypt')

const { updateUser, uploadProfileImage ,getUserInfo,getFavorites,getBookings} = require("../models/profileModel");

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


const favorites = asyncErrorHandler(async(req,res) => {
  // const userId = req.decoded.id;
  const userId = req.params.id;
  const favs = await getFavorites(userId);
  console.log(favs)
  if(!favs) throw new ApiError(404,"User info not found");
   sendResponse(res,{data:favs,message:"Info fetched successfully!!"})
})


const bookings = asyncErrorHandler(async(req,res) => {
  // const userId = req.decoded.id;
  const userId = req.params.id;
  const bookingInfo = await getBookings(userId);
  console.log(bookingInfo)
  if(!bookingInfo) throw new ApiError(404," booking found or User  not found");
   sendResponse(res,{data:bookingInfo,message:"Info fetched successfully!!"})
})


module.exports = {updateProfile,userInfo,favorites,bookings}


