const budgetModel = require('../models/budgetModel');

// get budget
exports.getBudget = async (req, res) => {
     budgetModel.getBudget(req, res);
}