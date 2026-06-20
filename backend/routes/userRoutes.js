const userControllers = require('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.get('/profile',authMiddleware ,userControllers.getProfileById);
router.put('/profile',authMiddleware ,userControllers.updateProfile);
router.put('/password',authMiddleware,userControllers.updatePassword);
router.get('/me',authMiddleware,userControllers.getLoggedInUser)
router.post('/logout',authMiddleware,userControllers.logoutUser)

module.exports = router; 
