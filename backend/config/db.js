// require("dotenv").config();
// const { Pool } = require("pg");

// const db = new Pool({
//      host: process.env.DB_HOST,
//      port: process.env.DB_PORT,
//      user: process.env.DB_USER,
//      password: process.env.DB_PASSWORD,
//      database: process.env.DB_NAME,
// });

// db.connect((err) => {

//      if (err) {
//           console.log("Database Connection Error", err);
//      } else {
//           console.log("Database Connected");
//      }

// });

// module.exports = db;

require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const db = process.env.DATABASE_URL
     ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: isProduction
               ? { rejectUnauthorized: false }
               : false
     })
     : new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
     });

module.exports = db;