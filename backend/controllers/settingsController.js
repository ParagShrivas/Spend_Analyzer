// controllers/settingsController.js

const bcrypt = require("bcrypt");
const settingsModel = require("../models/settingsModel");

const escapeCsvValue = (value) => {
     if (value === null || value === undefined) {
          return "";
     }

     return `"${String(value).replace(/"/g, '""')}"`;
};

exports.getSettings = async (req, res) => {
     try {
          const settings = await settingsModel.getOrCreateSettings(req.user.id);

          return res.status(200).json({ settings });
     } catch (error) {
          console.error("Get settings error:", error);

          return res.status(500).json({
               message: "Unable to fetch settings"
          });
     }
};

exports.updateNotifications = async (req, res) => {
     try {
          const {
               dashboardNotifications,
               reminderEmails,
               alertEmails,
               upcomingReminderEmails,
               budgetAlerts
          } = req.body;

          const settings = await settingsModel.updateNotifications(req.user.id, {
               dashboardNotifications: Boolean(dashboardNotifications),
               reminderEmails: Boolean(reminderEmails),
               alertEmails: Boolean(alertEmails),
               upcomingReminderEmails: Boolean(upcomingReminderEmails),
               budgetAlerts: Boolean(budgetAlerts)
          });

          return res.status(200).json({
               message: "Notification settings saved successfully",
               settings
          });
     } catch (error) {
          console.error("Update notifications error:", error);

          return res.status(500).json({
               message: "Unable to save notification settings"
          });
     }
};

exports.updatePrivacy = async (req, res) => {
     try {
          const {
               expenseVisibility,
               activityTracking,
               productEmails
          } = req.body;

          if (!["private", "shared"].includes(expenseVisibility)) {
               return res.status(400).json({
                    message: "Invalid expense visibility option"
               });
          }

          const settings = await settingsModel.updatePrivacy(req.user.id, {
               expenseVisibility,
               activityTracking: Boolean(activityTracking),
               productEmails: Boolean(productEmails)
          });

          return res.status(200).json({
               message: "Privacy settings saved successfully",
               settings
          });
     } catch (error) {
          console.error("Update privacy error:", error);

          return res.status(500).json({
               message: "Unable to save privacy settings"
          });
     }
};

exports.exportData = async (req, res) => {
     try {
          const data = await settingsModel.getExportData(req.user.id);

          const rows = [];

          // Profile
          if (data.profile) {
               rows.push({
                    record_type: "profile",
                    name: data.profile.user_name || "",
                    email: data.profile.user_email || "",
                    title: "",
                    category: "",
                    amount: "",
                    date: "",
                    time: "",
                    status: ""
               });
          }

          // Settings
          if (data.settings) {
               rows.push({
                    record_type: "settings",
                    name: "",
                    email: "",
                    title: "",
                    category: "",
                    amount: "",
                    date: "",
                    time: "",
                    status: ""
               });
          }

          // Expenses
          (data.expenses || []).forEach((expense) => {
               rows.push({
                    record_type: "expense",
                    name: "",
                    email: "",
                    title: expense.expense_title || expense.title || "",
                    category: expense.expense_category || expense.category || "",
                    amount: expense.amount ?? "",
                    date: expense.expense_date || "",
                    time: "",
                    status: ""
               });
          });

          // Reminder / Alert
          (data.notifications || []).forEach((notification) => {
               rows.push({
                    record_type:
                         notification.type === "alert"
                              ? "bill_alert"
                              : "reminder",
                    name: "",
                    email: "",
                    title: notification.title || "",
                    category: notification.category || "",
                    amount: notification.amount ?? "",
                    date: notification.notify_date || "",
                    time: notification.notify_time || "",
                    status: notification.status || ""
               });
          });

          const headers = [
               "record_type",
               "name",
               "email",
               "title",
               "category",
               "amount",
               "date",
               "time",
               "status"
          ];

          const csvRows = [
               headers.join(","),
               ...rows.map((row) =>
                    headers
                         .map((header) => escapeCsvValue(row[header]))
                         .join(",")
               )
          ];

          res.setHeader(
               "Content-Disposition",
               "attachment; filename=spend-analyzer-export.csv"
          );

          res.setHeader(
               "Content-Type",
               "text/csv; charset=utf-8"
          );

          return res.status(200).send(`\uFEFF${csvRows.join("\n")}`);
     } catch (error) {
          console.error("Export CSV error:", error);

          return res.status(500).json({
               message: "Unable to export account data"
          });
     }
};

exports.clearNotifications = async (req, res) => {
     try {
          const deletedCount = await settingsModel.clearNotifications(req.user.id);

          return res.status(200).json({
               message: `${deletedCount} notification(s) cleared successfully`
          });
     } catch (error) {
          console.error("Clear notifications error:", error);

          return res.status(500).json({
               message: "Unable to clear notifications"
          });
     }
};

exports.deleteAccount = async (req, res) => {
     try {
          const { password } = req.body;

          if (!password) {
               return res.status(400).json({
                    message: "Password is required to delete your account"
               });
          }

          const user = await settingsModel.getUserPassword(req.user.id);

          if (!user) {
               return res.status(404).json({
                    message: "User not found"
               });
          }

          const isCorrect = await bcrypt.compare(
               password,
               user.user_password
          );

          if (!isCorrect) {
               return res.status(401).json({
                    message: "Password is incorrect"
               });
          }

          await settingsModel.deleteUserAccount(req.user.id);

          res.clearCookie("token");

          return res.status(200).json({
               message: "Account deleted successfully"
          });
     } catch (error) {
          console.error("Delete account error:", error);

          return res.status(500).json({
               message: "Unable to delete account"
          });
     }
};