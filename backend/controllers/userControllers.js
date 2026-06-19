const userModel = require('../models/userModel');

exports.registerUser = (req, res) => {
     userModel.createUser(req, res);
}

exports.loginUser = (req, res) => {
     userModel.loginUser(req, res);
}

// exports.getAllUsers = (req, res) => {
//      userModel.getAllUsers(req, res);
// }