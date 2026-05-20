const userControllers = require('../controllers/userControllers');
const express = require('express');
const router = express.Router();

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
// router.get('/all', userControllers.getAllUsers);

module.exports = router; 
