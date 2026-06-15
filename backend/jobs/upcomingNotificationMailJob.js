const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { reminderMailTemplate } = require("../utils/notificationMailTemplate");

const startUpcomingNotificationMailJob = () => {
     // Runs every day at 9 AM
     cron.schedule("0 9 * * *", () => {
          console.log("Checking upcoming notifications for mail...");

          const query = `
               SELECT 
                    n.*,
                    u.user_email
               FROM notifications n
               JOIN users u ON n.user_id = u.user_id
               WHERE n.status = 'active'
               AND n.mail_sent = false
               AND n.notify_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
               ORDER BY n.notify_date ASC, n.notify_time ASC
          `;

          db.query(query, async (err, result) => {
               if (err) {
                    console.error("Upcoming mail job error:", err.message);
                    return;
               }

               const notifications = result.rows;

               for (const notification of notifications) {
                    try {
                         const html = reminderMailTemplate({
                              name: "User",
                              type: notification.type,
                              title: notification.title,
                              category: notification.category,
                              amount: notification.amount,
                              date: notification.notify_date,
                              time: notification.notify_time,
                              note: notification.note
                         });

                         const mailResult = await sendMail({
                              to: notification.user_email,
                              subject:
                                   notification.type === "alert"
                                        ? `Upcoming Bill Alert: ${notification.title}`
                                        : `Upcoming Reminder: ${notification.title}`,
                              html
                         });

                         if (mailResult.success) {
                              await db.query(
                                   `
                                   UPDATE notifications
                                   SET mail_sent = true
                                   WHERE notification_id = $1
                                   `,
                                   [notification.notification_id]
                              );

                              console.log("Upcoming mail sent:", notification.notification_id);
                         } else {
                              console.log("Mail failed:", mailResult.error);
                         }
                    } catch (error) {
                         console.error("Error sending upcoming mail:", error.message);
                    }
               }
          });
     });
};

module.exports = startUpcomingNotificationMailJob;