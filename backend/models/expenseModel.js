const db = require('../config/db');

exports.addExpense = async (req, res) => {
     const { title,
          amount,
          category,
          date,
          description } = req.body;

     const userId = req.user.id;

     const query = "INSERT INTO expenses (user_id, title, amount, category, expense_date, description) VALUES ($1, $2, $3, $4, $5, $6)";

     db.query(query,[userId, title, amount, category, date, description], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }    
          return res.status(200).json({ message: "Expense added successfully" });
     })
};
