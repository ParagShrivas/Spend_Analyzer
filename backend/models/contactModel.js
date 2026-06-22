const db = require("../config/db");

exports.sendMessage = (req, res) => {
     const { name, email, subject, message } = req.body;

     if (
          !name?.trim() ||
          !email?.trim() ||
          !subject?.trim() ||
          !message?.trim()
     ) {
          return res.status(400).json({
               message: "Please fill in all fields"
          });
     }

     const query = `
          INSERT INTO contact (name, email, subject, message)
          VALUES ($1, $2, $3, $4)
          RETURNING *
     `;

     db.query(
          query,
          [
               name.trim(),
               email.trim(),
               subject.trim(),
               message.trim()
          ],
          (err, result) => {
               if (err) {
                    console.error("Contact message error:", err);

                    return res.status(500).json({
                         message: "Unable to send the message"
                    });
               }

               return res.status(201).json({
                    message: "Message Sent Successfully!",
                    contact: result.rows[0]
               });
          }
     );
};