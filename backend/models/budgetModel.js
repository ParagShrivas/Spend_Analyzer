const db = require('../config/db');

exports.getBudget = async (req,res)=>{
     const userId = req.user.id;
     const query = "SELECT budget_amount,budget_month,budget_year FROM budgets WHERE user_id = $1";

     db.query(query,[userId], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }    
          return res.status(200).json(result.rows[0]);
     })
}