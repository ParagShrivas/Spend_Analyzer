const notificationModel = require("../models/notificationModel");

exports.addNotification = async (req, res) => {
     notificationModel.addNotification(req, res);
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