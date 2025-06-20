require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const uri = process.env.MONGODB_URI;

const stuffRoutes = require("./routes/stuff");

// Connect to MongoDB Atlas
mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Unable to connect");
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// TODO
// /api/auth/signup
app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Sign up successfully",
  });
});

// TODO
// /api/auth/login
app.post("/api/auth/login", (req, res, next) => {
  // Simulating a login
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  // Simulating a successful login
  res.status(200).json({
    message: "Login successful",
    userId: 1, // Simulated user ID
    token: "fake-jwt-token", // Simulated JWT token
  });
});

app.use("/api/books", stuffRoutes);

// Export the app for use in server.js
module.exports = app;
