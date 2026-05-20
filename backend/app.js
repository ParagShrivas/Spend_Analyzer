const express = require("express");
const userRoutes = require('./routes/userRoutes');
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

module.exports = app;