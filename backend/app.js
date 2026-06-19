const express = require("express");
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
     cors({
          origin: "http://localhost:3000",
          credentials: true,
     })
);

app.use('/user',userRoutes);
app.use('/expense', expenseRoutes);
app.use('/budget', budgetRoutes);
app.use('/notification', notificationRoutes);

module.exports = app;