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
      res.status(200).json({ books });
    })
    .catch((error) => {
      // Handle error if books cannot be retrieved
      res.status(400).json({
        error: error.message || "Failed to retrieve books",
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
      res.status(200).json({ book });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to retrieve this book",
      });
    });
});

// TODO
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

// /api/books    ---> Done
app.post("/api/books", (req, res, next) => {
  const {
    userId,
    title,
    author,
    imageUrl,
    year,
    genre,
    ratings,
    averageRating,
  } = req.body;
  // Validate required fields
  if (!userId || !title || !author || !imageUrl || !year || !genre) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const book = new Book({
    userId,
    title,
    author,
    imageUrl,
    year,
    genre,
    ratings: ratings || [],
    averageRating: averageRating || 0,
  });

  book
    .save()
    .then((savedBook) => {
      res.status(201).json({
        message: "Book saved successfully!",
        book: savedBook,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to save book",
      });
    });
});

// TODO
// /api/books/:id/rating
app.post("/api/books/:id/rating", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "successfully",
  });
});

// PUT /api/books/:id  ---> Done
app.put("/api/books/:id", (req, res, next) => {
  const {
    userId,
    title,
    author,
    imageUrl,
    year,
    genre,
    ratings,
    averageRating,
  } = req.body;

  // Basic validation
  if (!userId || !title || !author || !imageUrl || !year || !genre) {
    return res.status(400).json({ error: "All fields are required." });
  }

  Book.updateOne(
    { _id: req.params.id },
    { userId, title, author, imageUrl, year, genre, ratings, averageRating }
  )
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(200).json({ message: "Book updated successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message || String(error) });
    });
});

// DELETE /api/books/:id     ---> Done
app.delete("/api/books/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(200).json({
        message: "Book deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || String(error),
      });
    });
});

// Export the app for use in server.js
module.exports = app;
