const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')

exports.registerUser = (req, res) => {
     userModel.createUser(req, res);
}

exports.loginUser = (req, res) => {
     userModel.loginUser(req, res);
}

exports.verifyLoginOtp = (req,res)=>{
     userModel.verifyLoginOtp(req,res)
}

exports.getProfileById = async (req, res) => {
     try {
          const userId = req.user.id;

          const user = await userModel.getProfileById(userId);

          if (!user) {
               return res.status(404).json({
                    message: "User profile not found"
               });
          }

          return res.status(200).json({
               user
          });
     } catch (error) {
          console.error("Get profile error:", error);

          return res.status(500).json({
               message: "Unable to fetch profile"
          });
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const {
               currentPassword,
               newPassword,
               confirmPassword
          } = req.body;

          if (!currentPassword || !newPassword || !confirmPassword) {
               return res.status(400).json({
                    message: "All password fields are required"
               });
          }

          if (newPassword.length < 8) {
               return res.status(400).json({
                    message: "New password must contain at least 8 characters"
               });
          }

          if (newPassword !== confirmPassword) {
               return res.status(400).json({
                    message: "New passwords do not match"
               });
          }

          const user = await userModel.getUserPassword(req.user.id);

          if (!user) {
               return res.status(404).json({
                    message: "User not found"
               });
          }

          const isCorrect = await bcrypt.compare(
               currentPassword,
               user.user_password
          );

          if (!isCorrect) {
               return res.status(401).json({
                    message: "Current password is incorrect"
               });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);

          await userModel.updatePassword(req.user.id, hashedPassword);

          return res.status(200).json({
               message: "Password updated successfully"
          });
     } catch (error) {
          console.error("Update password error:", error);

          return res.status(500).json({
               message: "Unable to update password"
          });
     }
};

exports.updateProfile = async (req, res) => {
     userModel.updateProfile(req, res);
}

exports.getLoggedInUser = (req,res)=>{
     userModel.getLoggedInUser(req,res);
}

exports.logoutUser = (req, res) => {
     userModel.logoutUser(req, res);
}