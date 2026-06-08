const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get', authMiddleware, budgetController.getBudget);

module.exports = router;