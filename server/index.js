import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./config/logger.js";
import { dbConnect } from "./config/db.js";
import { AdminRouter, MoodRouter } from "./routes/index.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Database Connection
dbConnect()
  .then(() => {
    logger.info("Database connected successfully");
  })
  .catch((error) => {
    logger.error("Database connection failed", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(" ") || [];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Logger Middleware
app.use((req, _, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api/admin", AdminRouter);
app.use("/api/mood", MoodRouter);

// Routes
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to the API",
    allowedOrigins: allowedOrigins,
  });
});

// Fallback Route for 404
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error("An error occurred:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
