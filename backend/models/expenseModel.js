const db = require("../config/db");

exports.addExpense = (req, res) => {
     console.log(req.user);
     const user_id = req.user.id;

     const {
          title,
          amount,
          category,
          date,
          description
     } = req.body;

     const query = `
          INSERT INTO expenses
          (
               user_id,
               title,
               amount,
               category,
               expense_date,
               description
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
     `;

     db.query(
          query,
          [
               user_id,
               title,
               amount,
               category,
               date,
               description
          ],
          (err, result) => {

               if (err) {

                    return res.status(500).json({
                         success: false,
                         message: err.message
                    });

               }

               res.status(201).json({
                    success: true,
                    message: "Expense Added Successfully",
                    expense: result.rows[0]
               });

          }
     );

};