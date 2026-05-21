const expenseModel = require("../models/expenseModel");

exports.addExpense = (req, res) => {
     expenseModel.addExpense(req, res);
}