const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { randomInt } = require("crypto");
const sendMail = require('../utils/sendMail')
const { loginOtpMailTemplate } = require("../utils/mailTemplates");

exports.getProfileById = async (userId) => {
     const query = `
          SELECT
               user_name,
               user_email,
               phone,
               created_at
          FROM users
          WHERE user_id = $1
     `;

     const result = await db.query(query, [userId]);

     return result.rows[0];
};

exports.createUser = (req, res) => {
     const { name, email, password } = req.body;

     const checkQuery = 'SELECT * FROM users WHERE user_email = $1';

     db.query(checkQuery, [email], async (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }
          if (result.rows.length > 0) {
               return res.status(400).json({ message: 'User already exists' });
          }

          const hashedPassword = await bcrypt.hash(password, 12);

          const query = 'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *';

          db.query(query, [name, email, hashedPassword], (err, result) => {
               if (err) {
                    return res.status(500).json({ message: err.message });
               }
               res.status(201).json({ message: 'User created successfully' });
          })
     })
}

exports.loginUser = async (req, res) => {
     try {
          const { email, password } = req.body;

          if (!email || !password) {
               return res.status(400).json({
                    message: "Email and password are required."
               });
          }

          const userResult = await db.query(
               `
               SELECT user_id, user_name, user_email, user_password
               FROM users
               WHERE user_email = $1
               `,
               [email.trim().toLowerCase()]
          );

          if (userResult.rows.length === 0) {
               return res.status(401).json({
                    message: "Invalid email or password."
               });
          }

          const user = userResult.rows[0];

          const isMatch = await bcrypt.compare(
               password,
               user.user_password
          );

          if (!isMatch) {
               return res.status(401).json({
                    message: "Invalid email or password."
               });
          }

          /* Generate random 4-digit OTP */
          const otp = randomInt(1000, 10000).toString();

          /* Never save plain OTP */
          const otpHash = await bcrypt.hash(otp, 10);

          await db.query(
               `
               INSERT INTO login_otps (
                    user_id,
                    otp_hash,
                    expires_at,
                    attempts
               )
               VALUES (
                    $1,
                    $2,
                    NOW() + INTERVAL '10 minutes',
                    0
               )
               ON CONFLICT (user_id)
               DO UPDATE SET
                    otp_hash = EXCLUDED.otp_hash,
                    expires_at = EXCLUDED.expires_at,
                    attempts = 0,
                    created_at = CURRENT_TIMESTAMP
               `,
               [user.user_id, otpHash]
          );

          const mailResult = await sendMail({
               to: user.user_email,
               subject: "Your Spend Analyzer login code",
               html: loginOtpMailTemplate({
                    name: user.user_name,
                    otp
               })
          });

          if (!mailResult.success) {
               await db.query(
                    "DELETE FROM login_otps WHERE user_id = $1",
                    [user.user_id]
               );

               return res.status(500).json({
                    message: "Unable to send OTP. Please try again."
               });
          }

          return res.status(200).json({
               message: "Verification code sent to your email.",
               requiresOtp: true
          });
     } catch (error) {
          console.error("Login OTP error:", error);

          return res.status(500).json({
               message: "Unable to process login."
          });
     }
};

exports.verifyLoginOtp = async (req, res) => {
     try {
          const { email, otp } = req.body;

          if (!email || !otp || otp.length !== 4) {
               return res.status(400).json({
                    message: "Enter a valid 4-digit verification code."
               });
          }

          const result = await db.query(
               `
               SELECT
                    u.user_id,
                    u.user_name,
                    u.user_email,
                    o.otp_hash,
                    o.expires_at,
                    o.attempts
               FROM users u
               INNER JOIN login_otps o
                    ON o.user_id = u.user_id
               WHERE u.user_email = $1
               `,
               [email.trim().toLowerCase()]
          );

          if (result.rows.length === 0) {
               return res.status(400).json({
                    message: "Verification code not found. Please login again."
               });
          }

          const user = result.rows[0];

          if (new Date(user.expires_at) < new Date()) {
               await db.query(
                    "DELETE FROM login_otps WHERE user_id = $1",
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "Verification code expired. Please login again."
               });
          }

          if (user.attempts >= 5) {
               await db.query(
                    "DELETE FROM login_otps WHERE user_id = $1",
                    [user.user_id]
               );

               return res.status(429).json({
                    message: "Too many incorrect attempts. Please login again."
               });
          }

          const isOtpCorrect = await bcrypt.compare(
               otp,
               user.otp_hash
          );

          if (!isOtpCorrect) {
               await db.query(
                    `
                    UPDATE login_otps
                    SET attempts = attempts + 1
                    WHERE user_id = $1
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "Incorrect verification code."
               });
          }

          await db.query(
               "DELETE FROM login_otps WHERE user_id = $1",
               [user.user_id]
          );

          const token = jwt.sign(
               {
                    id: user.user_id,
                    name:user.user_name,
                    email: user.user_email
               },
               process.env.JWT_SECRET,
               {
                    expiresIn: "24h"
               }
          );

          res.cookie("token", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               path: "/",
               maxAge: 7 * 24 * 60 * 60 * 1000
          });

          return res.status(200).json({
               message: "Login verified successfully.",
               user: {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    user_email: user.user_email
               }
          });
     } catch (error) {
          console.error("Verify login OTP error:", error);

          return res.status(500).json({
               message: "Unable to verify login code."
          });
     }
};

exports.getUserPassword = async (userId) => {
     const result = await db.query(
          `
          SELECT user_id, user_password
          FROM users
          WHERE user_id = $1
          `,
          [userId]
     );

     return result.rows[0];
};

exports.updatePassword = async (userId, hashedPassword) => {
     await db.query(
          `
          UPDATE users
          SET user_password = $1
          WHERE user_id = $2
          `,
          [hashedPassword, userId]
     );
};

exports.updateProfile = async (req, res) => {
     try {
          const { user_name, user_email, phone } = req.body;
          const userId = req.user.id;

          const query = `
               UPDATE users
               SET
                    user_name = $1,
                    user_email = $2,
                    phone = $3
               WHERE user_id = $4
               RETURNING
                    user_name,
                    user_email,
                    phone,
                    created_at
          `;

          const result = await db.query(query, [
               user_name,
               user_email,
               phone || null,
               userId
          ]);

          if (result.rows.length === 0) {
               return res.status(404).json({
                    message: "User not found"
               });
          }

          return res.status(200).json({
               message: "Profile updated successfully",
               user: result.rows[0]
          });
     } catch (error) {
          console.error("Update profile error:", error);

          return res.status(500).json({
               message: "Unable to update profile"
          });
     }
};

exports.getLoggedInUser = async (req, res) => {
     try {
          const result = await db.query(
               `
               SELECT user_id, user_name, user_email
               FROM users
               WHERE user_id = $1
               `,
               [req.user.id]
          );

          if (result.rows.length === 0) {
               return res.status(404).json({
                    message: "User not found"
               });
          }

          return res.status(200).json({
               user: result.rows[0]
          });
     } catch (error) {
          console.error("Get logged-in user error:", error);

          return res.status(500).json({
               message: "Unable to verify login"
          });
     }
};

exports.logoutUser = (req, res) => {
     res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
     return res.status(200).json({ message: "Logged out successfully" });
}