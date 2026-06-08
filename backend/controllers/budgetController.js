const budgetModel = require('../models/budgetModel');

// get budget
exports.getBudget = async (req, res) => {
     budgetModel.getBudget(req, res);
}

// update budget
exports.updateBudget = async (req, res) => {
     budgetModel.updateBudget(req, res);
}