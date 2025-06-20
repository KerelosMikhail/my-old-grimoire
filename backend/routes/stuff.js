const express = require("express");
const router = express.Router();

const Book = require("../models/book");

// Array of books /api/books    ---> Done
router.get("/", (req, res, next) => {
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

// Single book /api/books/:id     ---> Done
router.get("/:id", (req, res, next) => {
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

// Array of books /api/books/bestrating     ---> Done
router.get("/bestrating", (req, res, next) => {
  // Returns an array of the top three rated books in the database
  // Find top 3 books sorted by averageRating (descending)
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to retrieve top rated books",
      });
    });
});

// /api/books    ---> Done --> need work
router.post("/", (req, res, next) => {
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

// /api/books/:id/rating
router.post("/:id/rating", async (req, res, next) => {
  const { userId, rating } = req.body;

  // Validate input
  if (!userId || typeof rating !== "number" || rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ error: "userId and rating (0-5) are required." });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Prevent user from rating twice
    if (book.ratings.some((r) => r.userId === userId)) {
      return res
        .status(400)
        .json({ error: "User has already rated this book." });
    }

    // Add new rating
    book.ratings.push({ userId, grade: rating });

    // Update averageRating
    const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message || String(error) });
  }
});

// PUT /api/books/:id  ---> Done   --> need work
router.put("/:id", (req, res, next) => {
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

// DELETE /api/books/:id     ---> Done   --> need work
router.delete("/:id", (req, res, next) => {
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

// Export the router
module.exports = router;
