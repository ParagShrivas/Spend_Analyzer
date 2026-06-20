const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

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
     const { email, password } = req.body;

     const query = 'SELECT * FROM users WHERE user_email = $1';

     db.query(query, [email], async (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }
          if (result.rows.length > 0) {
               const user = result.rows[0];

               // very password 
               const isMatch = await bcrypt.compare(password, user.user_password);

               if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid email or password' });
               }

               // Generate JWT Token
               const token = jwt.sign(
                    {
                         id: user.user_id,
                         email: user.user_email,
                         name: user.user_name,
                    },
                    process.env.JWT_SECRET,
                    {
                         expiresIn: "24h",
                    }
               );

               // Store Cookie
               res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
               });

               res.status(200).json({ message: 'Login successful', token });
          }
          else {
               res.status(401).json({ message: 'Invalid email or password' });
          }
     })
}

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

exports.logoutUser = (req, res) => {
     res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
     return res.status(200).json({ message: "Logged out successfully" });
}