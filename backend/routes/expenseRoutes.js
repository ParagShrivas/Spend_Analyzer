const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/add',authMiddleware, expenseController.addExpense);
router.get('/get', authMiddleware, expenseController.getExpenses);
router.delete('/delete/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;