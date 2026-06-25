const pool = require("../config/db");

// Find account by email
const findUserByEmail = async (email) => {
     const result = await pool.query(
          `
               SELECT user_id, user_email
               FROM users
               WHERE LOWER(user_email) = LOWER($1)
               LIMIT 1
          `,
          [email]
     );

     return result.rows[0] || null;
};

// Remove only old forgot-password OTPs.
const deleteOldForgotOtps = async (userId) => {
     await pool.query(
          `
               DELETE FROM login_otps
               WHERE user_id = $1
               AND purpose = 'forgot_password'
          `,
          [userId]
     );
};

// Save new forgot-password OTP
const createForgotPasswordOtp = async ({ userId, otpHash }) => {
     const result = await pool.query(
          `
               INSERT INTO login_otps (
                    user_id,
                    purpose,
                    otp_hash,
                    expires_at,
                    attempts,
                    is_verified,
                    created_at
               )
               VALUES (
                    $1,
                    'forgot_password',
                    $2,
                    NOW() + INTERVAL '10 minutes',
                    0,
                    FALSE,
                    NOW()
               )
               RETURNING *
          `,
          [userId, otpHash]
     );

     return result.rows[0];
};

// Get latest active forgot-password OTP
const getForgotPasswordOtp = async (userId) => {
     const result = await pool.query(
          `
               SELECT
                    user_id,
                    otp_hash,
                    expires_at,
                    attempts,
                    is_verified,
                    created_at
               FROM login_otps
               WHERE user_id = $1
               AND purpose = 'forgot_password'
               AND is_verified = FALSE
               ORDER BY created_at DESC
               LIMIT 1
          `,
          [userId]
     );

     return result.rows[0] || null;
};

// Increase incorrect attempt count
const increaseOtpAttempts = async (userId) => {
     await pool.query(
          `
               UPDATE login_otps
               SET attempts = attempts + 1
               WHERE user_id = $1
               AND purpose = 'forgot_password'
               AND is_verified = FALSE
          `,
          [userId]
     );
};

// Mark OTP verified and save reset token
const verifyForgotPasswordOtp = async ({
     userId,
     otpHash,
     resetTokenHash
}) => {
     const result = await pool.query(
          `
               UPDATE login_otps
               SET
                    is_verified = TRUE,
                    verified_at = NOW(),
                    otp_hash = NULL,
                    reset_token_hash = $1,
                    reset_token_expires_at = NOW() + INTERVAL '10 minutes'
               WHERE user_id = $2
               AND purpose = 'forgot_password'
               AND otp_hash = $3
               AND is_verified = FALSE
               RETURNING *
          `,
          [resetTokenHash, userId, otpHash]
     );

     return result.rows[0] || null;
};

// Update password only when valid reset session exists
const updatePasswordWithResetToken = async ({
     userId,
     resetTokenHash,
     hashedPassword
}) => {
     const client = await pool.connect();

     try {
          await client.query("BEGIN");

          const passwordResult = await client.query(
               `
                    UPDATE users u
                    SET user_password = $1
                    FROM login_otps o
                    WHERE u.user_id = o.user_id
                    AND u.user_id = $2
                    AND o.purpose = 'forgot_password'
                    AND o.is_verified = TRUE
                    AND o.reset_token_hash = $3
                    AND o.reset_token_expires_at > NOW()
                    RETURNING u.user_id
               `,
               [hashedPassword, userId, resetTokenHash]
          );

          if (passwordResult.rows.length === 0) {
               await client.query("ROLLBACK");
               return false;
          }

          await client.query(
               `
                    DELETE FROM login_otps
                    WHERE user_id = $1
                    AND purpose = 'forgot_password'
               `,
               [userId]
          );

          await client.query("COMMIT");
          return true;
     } catch (error) {
          await client.query("ROLLBACK");
          throw error;
     } finally {
          client.release();
     }
};

module.exports = {
     findUserByEmail,
     deleteOldForgotOtps,
     createForgotPasswordOtp,
     getForgotPasswordOtp,
     increaseOtpAttempts,
     verifyForgotPasswordOtp,
     updatePasswordWithResetToken
};