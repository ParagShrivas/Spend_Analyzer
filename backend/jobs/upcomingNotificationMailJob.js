const cron = require("node-cron");
const db = require("../config/db");
const sendMail = require("../utils/sendMail");
const { dueMailTemplate } = require("../utils/mailTemplates");

const startUpcomingNotificationMailJob = () => {
     cron.schedule("* * * * *", () => {

          const query = `
               WITH notifications AS (
                    SELECT notification_id
                    FROM notifications
                    WHERE status = 'active'
                    AND email_sent = false
                    AND email_processing = false
                    AND (
                         notify_date + COALESCE(notify_time, '00:00:00'::time)
                    ) <= NOW()
                    ORDER BY notify_date ASC, notify_time ASC
                    LIMIT 100
                    FOR UPDATE SKIP LOCKED
               )
               UPDATE notifications n
               SET email_processing = true,
                   updated_at = CURRENT_TIMESTAMP
               FROM notifications d
               WHERE n.notification_id = d.notification_id
               RETURNING n.*
          `;

          db.query(query, async (err, result) => {
               if (err) {
                    console.error("Upcoming email job query error:", err.message);
                    return;
               }

               const notifications = result.rows;

               if (notifications.length === 0) {
                    return;
               }

               for (const notification of notifications) {
                    try {
                         const userQuery = `
                              SELECT user_email,user_name
                              FROM users
                              WHERE user_id = $1
                         `;

                         const userResult = await db.query(userQuery, [notification.user_id]);

                         if (userResult.rows.length === 0) {
                              await markEmailFailed(
                                   notification.notification_id,
                                   "User not found"
                              );
                              continue;
                         }

                         const userEmail = userResult.rows[0].user_email;
                         const userName = userResult.rows[0].user_name;

                         const html = dueMailTemplate({
                              name: userName,
                              type: notification.type,
                              title: notification.title,
                              category: notification.category,
                              amount: notification.amount,
                              date: notification.notify_date,
                              time: notification.notify_time,
                              note: notification.note
                         });

                         const mailResult = await sendMail({
                              to: userEmail,
                              subject:
                                   notification.type === "alert"
                                        ? `Upcoming Bill Alert: ${notification.title}`
                                        : `Upcoming Reminder: ${notification.title}`,
                              html
                         });

                         if (mailResult.success) {
                              await markEmailSent(notification.notification_id);
                         } else {
                              await markEmailFailed(
                                   notification.notification_id,
                                   mailResult.error || "Mail failed"
                              );
                         }
                    } catch (error) {
                         await markEmailFailed(
                              notification.notification_id,
                              error.message || "Mail job failed"
                         );
                    }
               }
          });
     }, {
          timezone: "Asia/Kolkata"
     });
};

const markEmailSent = async (notificationId) => {
     await db.query(
          `
          UPDATE notifications
          SET email_sent = true,
              email_processing = false,
              email_sent_at = CURRENT_TIMESTAMP,
              last_email_error = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE notification_id = $1
          `,
          [notificationId]
     );

     // console.log(`Email sent for notification ${notificationId}`);
};

const markEmailFailed = async (notificationId, errorMessage) => {
     await db.query(
          `
          UPDATE notifications
          SET email_processing = false,
              email_attempts = email_attempts + 1,
              last_email_error = $2,
              updated_at = CURRENT_TIMESTAMP
          WHERE notification_id = $1
          `,
          [notificationId, errorMessage]
     );

     console.log(`Email failed for notification ${notificationId}: ${errorMessage}`);
};

module.exports = startUpcomingNotificationMailJob;