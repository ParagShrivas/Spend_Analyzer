const expenseModel = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
     expenseModel.addExpense(req, res);
};

exports.getExpenses = async (req, res) => {
     expenseModel.getExpenses(req, res);
}