require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const uri = process.env.MONGODB_URI;

const stuffRoutes = require("./routes/stuff");
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

app.post("/api/auth", userRoutes);

app.use("/api/books", stuffRoutes);

// Export the app for use in server.js
module.exports = app;
