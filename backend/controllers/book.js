const Book = require("../models/book");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      // Returns an array of all books.
      res.status(200).json(books);
    })
    .catch((error) => {
      // Handle error if books cannot be retrieved
      res.status(400).json({
        error: error.message || "Failed to retrieve books",
      });
    });
};

exports.getBookById = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message || "Failed to retrieve this book",
      });
    });
};

exports.getBestRatedBooks = (req, res, next) => {
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
};

exports.createBook = (req, res, next) => {
  let bookObject;
  try {
    bookObject = JSON.parse(req.body.book);
  } catch (err) {
    return res.status(400).json({ error: "Invalid book data" });
  }

  // Basic validation
  if (!bookObject.title || !bookObject.author) {
    return res.status(400).json({ error: "Title and author are required." });
  }

  const url = req.protocol + "://" + req.get("host");
  const imageUrl = req.file ? url + "/images/" + req.file.filename : "";

  const book = new Book({
    ...bookObject,
    imageUrl,
  });

  book
    .save()
    .then((savedBook) =>
      res
        .status(201)
        .json({ message: "Book saved successfully!", book: savedBook })
    )
    .catch((error) =>
      res.status(400).json({ error: error.message || String(error) })
    );
};

exports.rateBook = async (req, res, next) => {
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
};

exports.modifyBook = (req, res, next) => {
  if (req.file) {
    let bookObject;
    try {
      bookObject = JSON.parse(req.body.book);
      const url = req.protocol + "://" + req.get("host");
      const imageUrl = req.file ? url + "/images/" + req.file.filename : "";
    } catch (err) {
      return res.status(400).json({ error: "Invalid book data" });
    }
  } else {
    bookObject = req.body;
  }

  // Prevent userId from being changed
  delete bookObject.userId;

  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized request" });
      }
      return Book.findByIdAndUpdate(
        req.params.id,
        { ...bookObject },
        { new: true, runValidators: true }
      );
    })
    .then((updatedBook) => {
      if (updatedBook) {
        res.status(200).json(updatedBook);
      }
      // If previous block returned a response, do nothing
    })
    .catch((error) => {
      res.status(400).json({ error: error.message || String(error) });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      // Check if the userId matches the book's userId (Only the owner can delete)
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Unauthorized request" });
      }
      // If the book has an image, delete it from the filesystem
      if (book.imageUrl) {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }
      return Book.deleteOne({ _id: req.params.id });
    })
    .then((result) => {
      if (!result) return;
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.status(200).json({ message: "Book deleted successfully!" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message || String(error) });
    });
};
