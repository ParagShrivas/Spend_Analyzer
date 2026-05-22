const expenseModel = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
     expenseModel.addExpense(req, res);
};