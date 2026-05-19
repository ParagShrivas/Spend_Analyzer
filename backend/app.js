const express = require("express");

const app = express();
app.use(express.json());

app.use("/",(req,res)=>{
     res.send("Welcome to Spend Analyzer API");
})

module.exports = app;