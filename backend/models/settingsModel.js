// models/settingsModel.js

const db = require("../config/db");

exports.getOrCreateSettings = async (userId) => {
     const query = `
          INSERT INTO user_settings (user_id)
          VALUES ($1)
          ON CONFLICT (user_id)
          DO UPDATE SET
               updated_at = user_settings.updated_at
          RETURNING *
     `;

     const result = await db.query(query, [userId]);

     return result.rows[0];
};

exports.updateNotifications = async (userId, settings) => {
     const query = `
          INSERT INTO user_settings (
               user_id,
               dashboard_notifications,
               reminder_emails,
               alert_emails,
               upcoming_reminder_emails,
               budget_alerts
          )
          VALUES ($1, $2, $3, $4, $5, $6)

          ON CONFLICT (user_id)
          DO UPDATE SET
               dashboard_notifications = EXCLUDED.dashboard_notifications,
               reminder_emails = EXCLUDED.reminder_emails,
               alert_emails = EXCLUDED.alert_emails,
               upcoming_reminder_emails = EXCLUDED.upcoming_reminder_emails,
               budget_alerts = EXCLUDED.budget_alerts,
               updated_at = CURRENT_TIMESTAMP

          RETURNING *
     `;

     const result = await db.query(query, [
          userId,
          settings.dashboardNotifications,
          settings.reminderEmails,
          settings.alertEmails,
          settings.upcomingReminderEmails,
          settings.budgetAlerts
     ]);

     return result.rows[0];
};

exports.updatePrivacy = async (userId, settings) => {
     const query = `
          INSERT INTO user_settings (
               user_id,
               expense_visibility,
               activity_tracking,
               product_emails
          )
          VALUES ($1, $2, $3, $4)

          ON CONFLICT (user_id)
          DO UPDATE SET
               expense_visibility = EXCLUDED.expense_visibility,
               activity_tracking = EXCLUDED.activity_tracking,
               product_emails = EXCLUDED.product_emails,
               updated_at = CURRENT_TIMESTAMP

          RETURNING *
     `;

     const result = await db.query(query, [
          userId,
          settings.expenseVisibility,
          settings.activityTracking,
          settings.productEmails
     ]);

     return result.rows[0];
};

exports.clearNotifications = async (userId) => {
     const result = await db.query(
          `
          DELETE FROM notifications
          WHERE user_id = $1
          `,
          [userId]
     );

     return result.rowCount;
};

exports.getExportData = async (userId) => {
     const [
          userResult,
          expenseResult,
          notificationResult,
          settingsResult
     ] = await Promise.all([
          db.query(
               `
               SELECT user_id, user_email, user_name
               FROM users
               WHERE user_id = $1
               `,
               [userId]
          ),

          db.query(
               `
               SELECT *
               FROM expenses
               WHERE user_id = $1
               ORDER BY expense_date DESC
               `,
               [userId]
          ),

          db.query(
               `
               SELECT *
               FROM notifications
               WHERE user_id = $1
               ORDER BY created_at DESC
               `,
               [userId]
          ),

          db.query(
               `
               SELECT *
               FROM user_settings
               WHERE user_id = $1
               `,
               [userId]
          )
     ]);

     return {
          profile: userResult.rows[0] || null,
          expenses: expenseResult.rows || [],
          notifications: notificationResult.rows || [],
          settings: settingsResult.rows[0] || null
     };
};

exports.deleteUserAccount = async (userId) => {
     const result = await db.query(
          `
          DELETE FROM users
          WHERE user_id = $1
          RETURNING user_id
          `,
          [userId]
     );

     return result.rows[0];
};

