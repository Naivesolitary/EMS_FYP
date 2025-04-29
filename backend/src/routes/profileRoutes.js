const express = require('express');
const {jwtAuth} = require('../middlewares/jwtAuth')
const router = express.Router();
const {updateProfile,userInfo,favorites,bookings} = require('../controllers/profileController')


router.put('/profile',[jwtAuth,updateProfile])
router.get('/profile',[jwtAuth,userInfo])
router.get(`/profile/favorites`,[jwtAuth,favorites])
router.get(`/profile/bookings`,[jwtAuth,bookings])
// router.get(`/profile/favorites/:id`,[favorites])  --- FOR POSTMAN TESTING
// router.get(`/profile/bookings/:id`,[bookings])

module.exports = router