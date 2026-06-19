const notificationModel = require("../models/notificationModel");
const sendMail = require("../utils/sendMail");
const { reminderMailTemplate } = require("../utils/mailTemplates");

exports.addNotification = async (req, res) => {
     try {
          const notification = await notificationModel.addNotification(req);

          const userEmail = req.user?.email;

          let mailResult = {
               success: false,
               message: "User email not found"
          };

          if (userEmail) {
               const html = reminderMailTemplate({
                    name: req.user?.name || "User",
                    type: notification.type,
                    title: notification.title,
                    category: notification.category,
                    amount: notification.amount,
                    date: notification.notify_date,
                    time: notification.notify_time,
                    note: notification.note
               });

               mailResult = await sendMail({
                    to: userEmail,
                    subject:
                         notification.type === "alert"
                              ? `Bill Alert Created: ${notification.title}`
                              : `Reminder Created: ${notification.title}`,
                    html
               });
          }

          return res.status(201).json({
               message: `${notification.type === "alert" ? "Alert" : "Reminder"} created successfully`,
               notification,
               mail: mailResult
          });
     } catch (error) {
          return res.status(error.status || 500).json({
               message: error.message || "Server error while creating notification"
          });
     }
};

exports.getNotifications = async (req, res) => {
     notificationModel.getNotifications(req, res);
};

exports.getUpcomingNotifications = async (req, res) => {
     notificationModel.getUpcomingNotifications(req, res);
};

exports.markAsRead = async (req, res) => {
     notificationModel.markAsRead(req, res);
};

exports.deleteNotification = async (req, res) => {
     notificationModel.deleteNotification(req, res);
};