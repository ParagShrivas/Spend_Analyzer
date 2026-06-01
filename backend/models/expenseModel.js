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

exports.getExpenses = async (req,res)=>{
     const userId = req.user.id;
     const query = "SELECT * FROM expenses WHERE user_id = $1 order by expense_date desc";

     db.query(query,[userId], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }
          return res.status(200).json(result.rows);
     })
}

exports.deleteExpense = async(req,res)=>{
     const expenseId = req.params.id;
     const userId = req.user.id;

     const query = "DELETE FROM expenses WHERE id = $1 AND user_id = $2";

     db.query(query,[expenseId, userId], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }
          if(result.rowCount === 0){
               return res.status(404).json({ message: "Expense not found" });
          }
          return res.status(200).json({ message: "Expense deleted successfully" });
     })
}