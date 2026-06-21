const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { randomInt, randomBytes } = require("crypto");
const sendMail = require("../utils/sendMail");

const {
     loginOtpMailTemplate,
     forgotPasswordOtpTemplate,
     passwordChangedMailTemplate
} = require("../utils/mailTemplates");

/* 
   PROFILE
 */

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

/* 
   REGISTER
 */

exports.createUser = (req, res) => {
     const { name, email, password } = req.body;

     const checkQuery = "SELECT * FROM users WHERE user_email = $1";

     db.query(checkQuery, [email], async (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }

          if (result.rows.length > 0) {
               return res.status(400).json({
                    message: "User already exists"
               });
          }

          const hashedPassword = await bcrypt.hash(password, 12);

          const query = `
               INSERT INTO users (
                    user_name,
                    user_email,
                    user_password
               )
               VALUES ($1, $2, $3)
               RETURNING *
          `;

          db.query(query, [name, email, hashedPassword], (err) => {
               if (err) {
                    return res.status(500).json({
                         message: err.message
                    });
               }

               return res.status(201).json({
                    message: "User created successfully"
               });
          });
     });
};

/* 
   LOGIN - SEND OTP
 */

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
                    SELECT
                         user_id,
                         user_name,
                         user_email,
                         user_password
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

          const otp = randomInt(1000, 10000).toString();
          const otpHash = await bcrypt.hash(otp, 10);

          await db.query(
               `
                    INSERT INTO login_otps (
                         user_id,
                         purpose,
                         otp_hash,
                         expires_at,
                         attempts,
                         is_verified,
                         verified_at,
                         reset_token_hash,
                         reset_token_expires_at
                    )
                    VALUES (
                         $1,
                         'login',
                         $2,
                         NOW() + INTERVAL '10 minutes',
                         0,
                         FALSE,
                         NULL,
                         NULL,
                         NULL
                    )
                    ON CONFLICT (user_id)
                    DO UPDATE SET
                         purpose = 'login',
                         otp_hash = EXCLUDED.otp_hash,
                         expires_at = EXCLUDED.expires_at,
                         attempts = 0,
                         is_verified = FALSE,
                         verified_at = NULL,
                         reset_token_hash = NULL,
                         reset_token_expires_at = NULL,
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
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'login'
                    `,
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

/* 
   LOGIN - VERIFY OTP
 */

exports.verifyLoginOtp = async (req, res) => {
     try {
          const { email, otp } = req.body;

          if (!email || !otp || !/^\d{4}$/.test(otp)) {
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
                    AND o.purpose = 'login'
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
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'login'
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "Verification code expired. Please login again."
               });
          }

          if (user.attempts >= 5) {
               await db.query(
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'login'
                    `,
                    [user.user_id]
               );

               return res.status(429).json({
                    message: "Too many incorrect attempts. Please login again."
               });
          }

          const isOtpCorrect = await bcrypt.compare(otp, user.otp_hash);

          if (!isOtpCorrect) {
               await db.query(
                    `
                         UPDATE login_otps
                         SET attempts = attempts + 1
                         WHERE user_id = $1
                         AND purpose = 'login'
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "Incorrect verification code."
               });
          }

          await db.query(
               `
                    DELETE FROM login_otps
                    WHERE user_id = $1
                    AND purpose = 'login'
               `,
               [user.user_id]
          );

          const token = jwt.sign(
               {
                    id: user.user_id,
                    name: user.user_name,
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

/* 
   FORGOT PASSWORD - SEND OTP
   POST /user/forgot-password
 */

exports.forgotPassword = async (req, res) => {
     try {
          const email = req.body.email?.trim().toLowerCase();

          if (!email) {
               return res.status(400).json({
                    message: "Email address is required."
               });
          }

          const userResult = await db.query(
               `
                    SELECT
                         user_id,
                         user_name,
                         user_email
                    FROM users
                    WHERE user_email = $1
               `,
               [email]
          );

          if (userResult.rows.length === 0) {
               return res.status(404).json({
                    message: "No account found with this email address."
               });
          }

          const user = userResult.rows[0];

          const otp = randomInt(1000, 10000).toString();
          const otpHash = await bcrypt.hash(otp, 10);

          await db.query(
               `
                    INSERT INTO login_otps (
                         user_id,
                         purpose,
                         otp_hash,
                         expires_at,
                         attempts,
                         is_verified,
                         verified_at,
                         reset_token_hash,
                         reset_token_expires_at
                    )
                    VALUES (
                         $1,
                         'forgot_password',
                         $2,
                         NOW() + INTERVAL '10 minutes',
                         0,
                         FALSE,
                         NULL,
                         NULL,
                         NULL
                    )
                    ON CONFLICT (user_id)
                    DO UPDATE SET
                         purpose = 'forgot_password',
                         otp_hash = EXCLUDED.otp_hash,
                         expires_at = EXCLUDED.expires_at,
                         attempts = 0,
                         is_verified = FALSE,
                         verified_at = NULL,
                         reset_token_hash = NULL,
                         reset_token_expires_at = NULL,
                         created_at = CURRENT_TIMESTAMP
               `,
               [user.user_id, otpHash]
          );

          const mailResult = await sendMail({
               to: user.user_email,
               subject: "Password Reset OTP - Spend Analyzer",
               html: forgotPasswordOtpTemplate({
                    name: user.user_name,
                    otp
               })
          });

          if (!mailResult.success) {
               await db.query(
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'forgot_password'
                    `,
                    [user.user_id]
               );

               return res.status(500).json({
                    message: "Unable to send password reset OTP."
               });
          }

          return res.status(200).json({
               message: "Password reset OTP sent to your email."
          });
     } catch (error) {
          console.error("Forgot password error:", error);

          return res.status(500).json({
               message: "Unable to process forgot password request."
          });
     }
};

/* 
   FORGOT PASSWORD - VERIFY OTP
   POST /user/verify-forgot-password-otp
 */

exports.verifyForgotPasswordOtp = async (req, res) => {
     try {
          const email = req.body.email?.trim().toLowerCase();
          const otp = req.body.otp?.trim();

          if (!email || !otp || !/^\d{4}$/.test(otp)) {
               return res.status(400).json({
                    message: "Enter a valid email and 4-digit OTP."
               });
          }

          const result = await db.query(
               `
                    SELECT
                         u.user_id,
                         o.otp_hash,
                         o.expires_at,
                         o.attempts,
                         o.is_verified
                    FROM users u
                    INNER JOIN login_otps o
                         ON o.user_id = u.user_id
                    WHERE u.user_email = $1
                    AND o.purpose = 'forgot_password'
               `,
               [email]
          );

          if (result.rows.length === 0) {
               return res.status(400).json({
                    message: "OTP not found. Please request a new code."
               });
          }

          const user = result.rows[0];

          if (user.is_verified) {
               return res.status(400).json({
                    message: "OTP is already verified. Please reset your password."
               });
          }

          if (new Date(user.expires_at) < new Date()) {
               await db.query(
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'forgot_password'
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "OTP expired. Please request a new code."
               });
          }

          if (user.attempts >= 5) {
               await db.query(
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'forgot_password'
                    `,
                    [user.user_id]
               );

               return res.status(429).json({
                    message:
                         "Too many incorrect attempts. Please request a new OTP."
               });
          }

          const isOtpCorrect = await bcrypt.compare(otp, user.otp_hash);

          if (!isOtpCorrect) {
               await db.query(
                    `
                         UPDATE login_otps
                         SET attempts = attempts + 1
                         WHERE user_id = $1
                         AND purpose = 'forgot_password'
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message: "Incorrect verification code."
               });
          }

          const resetToken = randomBytes(32).toString("hex");
          const resetTokenHash = await bcrypt.hash(resetToken, 10);

          await db.query(
               `
          UPDATE login_otps
          SET
               is_verified = TRUE,
               verified_at = CURRENT_TIMESTAMP,
               reset_token_hash = $1,
               reset_token_expires_at = NOW() + INTERVAL '10 minutes'
          WHERE user_id = $2
          AND purpose = 'forgot_password'
     `,
               [resetTokenHash, user.user_id]
          );

          return res.status(200).json({
               message: "OTP verified successfully. Create your new password.",
               resetToken
          });
     } catch (error) {
          console.error("Verify forgot password OTP error:", error);

          return res.status(500).json({
               message: "Unable to verify password reset OTP."
          });
     }
};

/* 
   FORGOT PASSWORD - RESET PASSWORD
   POST /user/reset-password
 */

exports.resetPassword = async (req, res) => {
     try {
          const email = req.body.email?.trim().toLowerCase();
          const resetToken = req.body.resetToken?.trim();
          const newPassword = req.body.newPassword;

          if (!email || !resetToken || !newPassword) {
               return res.status(400).json({
                    message: "Required reset details are missing."
               });
          }

          if (newPassword.length < 6) {
               return res.status(400).json({
                    message: "Password must be at least 6 characters."
               });
          }

          const result = await db.query(
               `
                    SELECT
                         u.user_id,
                         u.user_name,
                         u.user_email,
                         o.reset_token_hash,
                         o.reset_token_expires_at
                    FROM users u
                    INNER JOIN login_otps o
                         ON o.user_id = u.user_id
                    WHERE u.user_email = $1
                    AND o.purpose = 'forgot_password'
                    AND o.is_verified = TRUE
                    LIMIT 1
               `,
               [email]
          );

          if (result.rows.length === 0) {
               return res.status(400).json({
                    message: "Invalid password reset request."
               });
          }

          const user = result.rows[0];

          if (
               !user.reset_token_expires_at ||
               new Date(user.reset_token_expires_at) < new Date()
          ) {
               await db.query(
                    `
                         DELETE FROM login_otps
                         WHERE user_id = $1
                         AND purpose = 'forgot_password'
                    `,
                    [user.user_id]
               );

               return res.status(400).json({
                    message:
                         "Password reset session expired. Please request a new OTP."
               });
          }

          const isTokenValid = await bcrypt.compare(
               resetToken,
               user.reset_token_hash
          );

          if (!isTokenValid) {
               return res.status(400).json({
                    message: "Invalid password reset request."
               });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 12);

          await db.query(
               `
                    UPDATE users
                    SET user_password = $1
                    WHERE user_id = $2
               `,
               [hashedPassword, user.user_id]
          );

          // Password is already updated. Email failure should not fail reset.
          try {
               const mailResult = await sendMail({
                    to: user.user_email,
                    subject: "Your Spend Analyzer password was changed",
                    html: passwordChangedMailTemplate({
                         name: user.user_name
                    })
               });

               if (!mailResult?.success) {
                    console.error(
                         "Password changed but confirmation email failed:",
                         mailResult?.message || mailResult?.error
                    );
               }
          } catch (mailError) {
               console.error(
                    "Password changed but confirmation email could not be sent:",
                    mailError
               );
          }

          await db.query(
               `
                    DELETE FROM login_otps
                    WHERE user_id = $1
                    AND purpose = 'forgot_password'
               `,
               [user.user_id]
          );

          return res.status(200).json({
               message:
                    "Password updated successfully. Please sign in with your new password."
          });
     } catch (error) {
          console.error("Reset password error:", error);

          return res.status(500).json({
               message: "Unable to reset password."
          });
     }
};


/* 
   USER PASSWORD
 */

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

/* 
   UPDATE PROFILE
 */

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

/* 
   GET LOGGED-IN USER
 */

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

/* 
   LOGOUT
 */

exports.logoutUser = (req, res) => {
     res.clearCookie("token", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
     });

     return res.status(200).json({
          message: "Logged out successfully"
     });
};
