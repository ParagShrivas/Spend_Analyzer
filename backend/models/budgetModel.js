const db = require('../config/db');

exports.getBudget = async (req,res)=>{
     const currentMonth = new Date().getMonth() + 1; 
     const currentYear = new Date().getFullYear();
     const userId = req.user.id;
     const query = "SELECT budget_amount FROM budgets WHERE user_id = $1 AND budget_month=$2 AND budget_year=$3";

     db.query(query,[userId,currentMonth,currentYear], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }    
          return res.status(200).json(result.rows);
     })
}

exports.updateBudget = async (req,res)=>{
     const currentMonth = new Date().getMonth() + 1; 
     const currentYear = new Date().getFullYear();
     const userId = req.user.id;
     const { monthlyBudget } = req.body;

     const checkQuery = "SELECT * FROM budgets WHERE user_id = $1 AND budget_month=$2 AND budget_year=$3";
     const insertQuery = "INSERT INTO budgets (user_id, budget_month, budget_year, budget_amount) VALUES ($1, $2, $3, $4)";
     const updateQuery = "UPDATE budgets SET budget_amount = $1 WHERE user_id = $2 AND budget_month=$3 AND budget_year=$4";

     db.query(checkQuery,[userId,currentMonth,currentYear], (err, result) => {
          if (err) {
               return res.status(500).json({ message: err.message });
          }
          if(result.rows.length === 0){
               db.query(insertQuery,[userId,currentMonth,currentYear,monthlyBudget], (err, result) => {
                    if (err) {
                         return res.status(500).json({ message: err.message });
                    }    
                    return res.status(200).json({ message: "Budget set successfully" });
               })
          }else{
               db.query(updateQuery,[monthlyBudget,userId,currentMonth,currentYear], (err, result) => {
                    if (err) {
                         return res.status(500).json({ message: err.message });
                    } 
                    return res.status(200).json({ message: "Budget updated successfully" });
               })
          }
     })
}