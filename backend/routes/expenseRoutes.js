const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const expenseControllers = require("../controllers/expenseControllers");

router.get("/test", (req, res) => {

     res.send("Expense Route Working");

});

router.post(
     "/add",
     authMiddleware,
     expenseControllers.addExpense
);

module.exports = router;