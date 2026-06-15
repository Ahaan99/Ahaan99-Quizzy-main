const express = require("express");
const app = express();
require("dotenv").config();

const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const routes = require("./routes/routes");
const database = require("./config/database");

const PORT = process.env.PORT || 4000;

database.connectToDB();

// ✅ CORS must be FIRST — before rate limiters so preflight OPTIONS requests pass through
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 14400,
  })
);

// Handle preflight OPTIONS requests for all routes
app.options("*", cors());

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many login attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Your server is up and running..." });
});

// Apply stricter rate limit to auth routes
app.use("/api/v1/login", authLimiter);
app.use("/api/v1/register", authLimiter);

app.use("/api/v1/", routes);

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the process and retry.`);
    process.exit(1);
  }
  throw err;
});
