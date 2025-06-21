const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

// Array of books /api/books    ---> Done
router.get("/", bookCtrl.getAllBooks);

// Single book /api/books/:id     ---> Done
router.get("/:id", bookCtrl.getBookById);

// Array of books /api/books/bestrating     ---> Done
router.get("/bestrating", bookCtrl.getBestRatedBooks);

// /api/books    ---> Done
router.post("/", auth, multer, bookCtrl.createBook);

// /api/books/:id/rating ---> Done
router.post("/:id/rating", auth, bookCtrl.rateBook);

// PUT /api/books/:id  ---> Done
router.put("/:id", auth, multer, bookCtrl.modifyBook);

// DELETE /api/books/:id     ---> Done
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
