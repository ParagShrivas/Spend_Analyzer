const expenseModel = require('../models/expenseModel');

// add expense
exports.addExpense = async (req, res) => {
     expenseModel.addExpense(req, res);
};

// fetch expenses
exports.getExpenses = async (req, res) => {
     expenseModel.getExpenses(req, res);
}

// delete expense
exports.deleteExpense = async (req, res) => {
     expenseModel.deleteExpense(req, res);
}

// update expense
exports.updateExpense = async (req, res) => {
     expenseModel.updateExpense(req, res);
}