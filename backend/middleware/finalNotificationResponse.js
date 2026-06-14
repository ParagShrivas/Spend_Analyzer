const finalNotificationResponse = (req, res) => {
     return res.status(201).json({
          message:
               req.body.type === "alert"
                    ? "Alert created successfully!"
                    : "Reminder created successfully!",
          notification: req.createdNotification,
          mail: req.mailResult || {
               success: false,
               message: "Mail not sent"
          }
     });
};

module.exports = finalNotificationResponse;