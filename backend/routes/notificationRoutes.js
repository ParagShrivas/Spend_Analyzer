const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, notificationController.addNotification);
router.get("/get", authMiddleware, notificationController.getNotifications);
router.get("/upcoming", authMiddleware, notificationController.getUpcomingNotifications);
router.put("/read/:id", authMiddleware, notificationController.markAsRead);
router.delete("/delete/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;