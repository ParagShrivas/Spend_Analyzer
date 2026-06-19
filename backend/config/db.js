require("dotenv").config();
const { Pool } = require("pg");

const db = new Pool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
});

db.connect((err) => {

     if (err) {
          console.log("Database Connection Error", err);
     } else {
          console.log("Database Connected");
     }

});

module.exports = db;