const Book = require("../models/book");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

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

exports.createBook = async (req, res, next) => {
  // Log incoming data for debugging
  // console.log("req.body:", req.body);
  // console.log("req.body.book:", req.body.book);
  // console.log("req.file:", req.file);

  let bookObject;
  try {
    // Parse the book object from the form data
    bookObject = JSON.parse(req.body.book);

    // console.log("bookObject:", bookObject);

    // Always set the userId from the authenticated user
    bookObject.userId = req.auth.userId;

    // Ensure ratings is an array
    if (
      !bookObject.ratings ||
      !Array.isArray(bookObject.ratings) ||
      bookObject.ratings.length === 0
    ) {
      bookObject.ratings = [];
    }

    if (Array.isArray(bookObject.ratings) && bookObject.ratings.length > 0) {
      const first = bookObject.ratings[0];
      if (typeof first.grade === "number" && !isNaN(first.grade)) {
        bookObject.ratings = [{ ...first, userId: req.auth.userId }];
      } else {
        bookObject.ratings = [];
      }
    }
  } catch (err) {
    console.error("Book creation error in try block:", err);
    return res.status(400).json({ error: "Invalid book data" });
  }

  // Basic validation
  if (!bookObject.title || !bookObject.author) {
    console.error("Book creation error: Missing title or author");

    return res.status(400).json({ error: "Title and author are required." });
  }

  // Handle image upload and processing
  let imageUrl = "";
  if (req.file) {
    try {
      const imagesDir = "images";
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }
      const filename = `image-${Date.now()}.jpeg`;
      const outputPath = path.join(imagesDir, filename);

      await sharp(req.file.buffer)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(outputPath);

      const url = req.protocol + "://" + req.get("host");
      imageUrl = `${url}/images/${filename}`;
    } catch (err) {
      console.error("Image processing error:", err);
      return res.status(500).json({ error: "Image processing failed" });
    }
  }

  // Create the Book instance
  const book = new Book({
    ...bookObject,
    imageUrl,
  });

  // console.log("Final bookObject before save:", bookObject);

  // Save the book to the database
  book
    .save()
    .then((savedBook) =>
      res
        .status(201)
        .json({ message: "Book saved successfully!", book: savedBook })
    )
    .catch((error) => {
      res.status(400).json({ error: error.message || String(error) });
    });
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

exports.modifyBook = async (req, res, next) => {
  let bookObject;
  let imageUrl;

  try {
    // Parse book object from form data if a file is uploaded, else use req.body directly
    if (req.file) {
      bookObject = JSON.parse(req.body.book);

      // Handle new image upload
      const imagesDir = "images";
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }
      const filename = `image-${Date.now()}.jpeg`;
      const outputPath = path.join(imagesDir, filename);

      await sharp(req.file.buffer)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(outputPath);

      const url = req.protocol + "://" + req.get("host");
      imageUrl = `${url}/images/${filename}`;
    } else {
      bookObject = req.body;
    }
  } catch (err) {
    console.error("Book modification error in try block:", err);
    return res.status(400).json({ error: "Invalid book data" });
  }

  // Prevent userId spoofing
  delete bookObject.userId;

  // Ensure ratings is an array and set userId for all ratings
  if (!Array.isArray(bookObject.ratings)) {
    bookObject.ratings = [];
  } else if (bookObject.ratings.length > 0) {
    // Only keep ratings with a valid grade and set userId
    bookObject.ratings = bookObject.ratings
      .filter((r) => typeof r.grade === "number" && !isNaN(r.grade))
      .map((rating) => ({
        ...rating,
        userId: req.auth.userId,
      }));
  }

  try {
    // Find the book to update
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    // Only the owner can modify
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: "Unauthorized request" });
    }

    // If a new image is uploaded, remove the old image file
    if (imageUrl && book.imageUrl) {
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${oldFilename}`, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
        }
      });
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        ...bookObject,
        ...(imageUrl ? { imageUrl } : {}),
      },
      { new: true, runValidators: true }
    );

    if (updatedBook) {
      res.status(200).json(updatedBook);
    }
  } catch (error) {
    console.error("Book modification error:", error);
    res.status(400).json({ error: error.message || String(error) });
  }
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
