require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Book = require("./models/book");

const uri = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Unable to connect");
  });
//try: npm install mongodb')

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

// /api/books    ---> Done
app.get("/api/books", (req, res, next) => {
  Book.find()
    .then((books) => {
      // Returns an array of all books.
      res.status(200).json(books);
    })
    .catch((error) => {
      // Handle error if books cannot be retrieved
      res.status(400).json({
        error: error,
      });
    });
});

//  /api/books/:id     ---> Done
app.get("/api/books/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

// /api/books/bestrating
app.get("/api/books/bestrating", (req, res, next) => {
  // Returns the book with the best rating.
  const bestRatedBook = {
    id: 1,
    title: "1984",
    author: "George Orwell",
    rating: 5,
  };

  res.status(200).json(bestRatedBook);
});

// /api/auth/signup
app.post("/api/auth/signup", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Sign up successfully",
  });
});

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

// /api/books    ---> Done
app.post("/api/books", (req, res, next) => {
  const book = new Book({
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings,
    averageRating: req.body.averageRating,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

// /api/books/:id/rating
app.post("/api/books/:id/rating", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "successfully",
  });
});

// PUT /api/books/:id  ---> Done
app.put("/api/books/:id", (req, res, next) => {
  const book = new Book({
    _id: req.params.id,
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings,
    averageRating: req.body.averageRating,
  });
  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(201).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

// DELETE /api/books/:id     ---> Done
app.delete("/api/books/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Book deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

// Export the app for use in server.js
module.exports = app;
