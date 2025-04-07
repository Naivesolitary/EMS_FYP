const express = require('express');
const router = express.Router();
const {createUser,verifyUser,allUsers,viewProfile,refreshToken,logout} = require('../controllers/userController');
const {jwtAuth} = require('../middlewares/jwtAuth')


// using jwtAuthmiddleware 
router.route('/').get(jwtAuth,allUsers)
router.route('/profile').get(jwtAuth,viewProfile);
router.route('/refresh-token').post(jwtAuth,refreshToken);
router.route('/logout').post(jwtAuth,logout)


router.route('/login').post(verifyUser);
router.route('/signup').post(createUser);




module.exports = router