const express = require("express");
const mongoose = require("mongoose");
const app = express();
const book = require("./models/book");
const book = require("./models/book");

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://kerelosmikhail:0M9bR06hdY0Go6NG@cluster0.kza7m8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
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

// /api/books
app.get("/api/books", (req, res, next) => {
  // Simulating a database query
  const books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  ];

  res.status(200).json(books);
});

//  /api/books/:id
app.get("/api/books/:id", (req, res, next) => {
  // Returns the book with the provided _id.

  res.status(200).json(bookId);
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

// /api/books
app.post("/api/books", (req, res, next) => {
  const book = new book({
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings,
    averageRating: req.body.averageRating,
  });
  thing
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

//   console.log(req.body);
//   res.status(201).json({
//     message: "successfully",
//   });
// });

// /api/books/:id/rating
app.post("/api/books/:id/rating", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "successfully",
  });
});

// PUT /api/books/:id
app.put("/api/books/:id", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({
    message: "Book updated successfully",
  });
});

// DELETE /api/books/:id
app.delete("/api/books/:id", (req, res, next) => {
  const bookId = req.params.id;
  console.log(`Book with ID ${bookId} deleted`);
  res.status(200).json({
    message: `Book with ID ${bookId} deleted successfully`,
  });
});

// Export the app for use in server.js
module.exports = app;
