const db = require("../config/db");

exports.addNotification = async (req) => {
     return new Promise((resolve, reject) => {
          const userId = req.user.id;

          const {
               type,
               title,
               category,
               amount,
               notifyDate,
               notifyTime,
               note
          } = req.body || {};

          if (!type || !title || !notifyDate) {
               return reject({
                    status: 400,
                    message: "Type, title and date are required"
               });
          }

          const query = `
               INSERT INTO notifications (
                    user_id,
                    type,
                    title,
                    category,
                    amount,
                    notify_date,
                    notify_time,
                    note
               )
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               RETURNING *
          `;

          db.query(
               query,
               [
                    userId,
                    type,
                    title.trim(),
                    category || "Other",
                    type === "alert" ? amount || null : null,
                    notifyDate,
                    notifyTime || null,
                    note || null
               ],
               (err, result) => {
                    if (err) {
                         return reject({
                              status: 500,
                              message: err.message
                         });
                    }

                    return resolve(result.rows[0]);
               }
          );
     });
};

exports.getNotifications = async (req, res) => {
     const userId = req.user.id;

     const query = `
          SELECT *
          FROM notifications
          WHERE user_id = $1
          ORDER BY notify_date ASC, notify_time ASC
     `;

     db.query(query, [userId], (err, result) => {
          if (err) {
               return res.status(500).json({
                    message: err.message
               });
          }

          return res.status(200).json(result.rows);
     });
};

exports.getUpcomingNotifications = async (req, res) => {
     const userId = req.user.id;

     const query = `
          SELECT *
          FROM notifications
          WHERE user_id = $1
          AND status = 'active'
          AND notify_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
          ORDER BY notify_date ASC, notify_time ASC
     `;

     db.query(query, [userId], (err, result) => {
          if (err) {
               return res.status(500).json({
                    message: err.message
               });
          }

          return res.status(200).json(result.rows);
     });
};

exports.markAsRead = async (req, res) => {
     const userId = req.user.id;
     const notificationId = req.params.id;

     const query = `
          UPDATE notifications
          SET is_read = true
          WHERE notification_id = $1 AND user_id = $2
          RETURNING *
     `;

     db.query(query, [notificationId, userId], (err, result) => {
          if (err) {
               return res.status(500).json({
                    message: err.message
               });
          }

          if (result.rowCount === 0) {
               return res.status(404).json({
                    message: "Notification not found"
               });
          }

          return res.status(200).json({
               message: "Notification marked as read",
               notification: result.rows[0]
          });
     });
};

exports.deleteNotification = async (req, res) => {
     const userId = req.user.id;
     const notificationId = req.params.id;

     const query = `
          DELETE FROM notifications
          WHERE notification_id = $1 AND user_id = $2
          RETURNING *
     `;

     db.query(query, [notificationId, userId], (err, result) => {
          if (err) {
               return res.status(500).json({
                    message: err.message
               });
          }

          if (result.rowCount === 0) {
               return res.status(404).json({
                    message: "Notification not found"
               });
          }

          return res.status(200).json({
               message: "Notification deleted successfully"
          });
     });
};