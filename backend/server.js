const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to Database
connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3,
];

//Enabling cors
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));

// Middleware
app.use(express.json());
// Middleware to handle invalid JSON errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err.message);
    return res
      .status(400)
      .json({ message: "Invalid JSON format. Please check your request." });
  }
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.get("/test", (req, res) => {
  res.send("It is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Error handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
