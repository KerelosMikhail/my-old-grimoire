require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const uri = process.env.MONGODB_URI;

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

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

app.use("/api/auth", userRoutes);

app.use("/api/books", bookRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

// // Middleware to handle errors
// app.use((error, req, res, next) => {
//   const status = error.status || 500;
//   const message = error.message || "An error occurred!";
//   res.status(status).json({
//     message: message,
//   });
// });

// Export the app for use in server.js
module.exports = app;
