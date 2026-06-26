const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://spend-analyzer-five.vercel.app",
  "http://localhost:3000"
].filter(Boolean);

/* Required when hosting behind Render, Railway, Nginx, etc. */
if (isProduction) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    /*
      Allows Postman, server health checks, and same-origin requests
      that do not send an Origin header.
    */
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(
      Object.assign(new Error("CORS policy does not allow this origin"), {
        status: 403,
      })
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* Handle OPTIONS preflight requests globally */
app.options("*", cors(corsOptions));

/* Stronger protection for login, register, OTP, reset password */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many account attempts. Please try again in 15 minutes.",
  },
});

/* General request protection */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

/* Prevent contact form spam */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many contact messages. Please try again later.",
  },
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Spend Analyzer API is running",
  });
});

/* Routes — each group gets its own limiter, no double counting */
app.use("/user", authLimiter, userRoutes);
app.use("/expense", apiLimiter, expenseRoutes);
app.use("/budget", apiLimiter, budgetRoutes);
app.use("/notification", apiLimiter, notificationRoutes);
app.use("/settings", apiLimiter, settingsRoutes);
app.use("/contact", contactLimiter, contactRoutes);

/* Invalid endpoint */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* Central error handler */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    message: isProduction
      ? "Something went wrong. Please try again."
      : err.message,
  });
});

module.exports = app;