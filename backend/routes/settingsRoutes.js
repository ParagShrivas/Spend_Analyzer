// routes/settingsRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const settingsController = require("../controllers/settingsController");

router.get("/", authMiddleware, settingsController.getSettings);

router.put(
     "/notifications",
     authMiddleware,
     settingsController.updateNotifications
);

router.put(
     "/privacy",
     authMiddleware,
     settingsController.updatePrivacy
);

router.get(
     "/export",
     authMiddleware,
     settingsController.exportData
);

router.delete(
     "/notifications",
     authMiddleware,
     settingsController.clearNotifications
);

router.delete(
     "/account",
     authMiddleware,
     settingsController.deleteAccount
);

module.exports = router;