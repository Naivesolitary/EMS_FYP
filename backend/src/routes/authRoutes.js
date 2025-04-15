const express = require('express');
const router = express.Router();
const {createUser,verifyUser,allUsers,viewProfile,newAccessToken,logout,getUserById} = require('../controllers/userController');
const {jwtAuth} = require('../middlewares/jwtAuth')


// using jwtAuthmiddleware 
router.route('/').get(allUsers)
router.route('/profile').get(jwtAuth,viewProfile);
router.route('/user/:id').get(getUserById);
router.route('/refresh-token').post(jwtAuth,newAccessToken);
router.route('/logout').post(jwtAuth,logout)


router.route('/login').post(verifyUser);
router.route('/signup').post(createUser);




module.exports = router