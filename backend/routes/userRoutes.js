const userControllers = require('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/verify-login-otp',userControllers.verifyLoginOtp)
router.get('/profile',authMiddleware ,userControllers.getProfileById);
router.put('/profile',authMiddleware ,userControllers.updateProfile);
router.put('/password',authMiddleware,userControllers.updatePassword);
router.get('/me',authMiddleware,userControllers.getLoggedInUser)
router.post('/logout',authMiddleware,userControllers.logoutUser)
router.post('/forgot-password', userControllers.forgotPassword);
router.post('/verify-forgot-password-otp',userControllers.verifyForgotPasswordOtp);
router.post('/reset-password', userControllers.resetPassword);

module.exports = router; 
