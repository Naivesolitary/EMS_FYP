const express = require('express');
const {jwtAuth} = require('../middlewares/jwtAuth')
const router = express.Router();
const {updateProfile,userInfo} = require('../controllers/profileController')


router.put('/profile',[jwtAuth,updateProfile])
router.get('/profile',[jwtAuth,userInfo])

module.exports = router