const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const stuffCtrl = require("../controllers/stuff");

// Array of books /api/books    ---> Done
router.get("/", stuffCtrl.getAllBooks);

// Single book /api/books/:id     ---> Done
router.get("/:id", stuffCtrl.getBookById);

// Array of books /api/books/bestrating     ---> Done
router.get("/bestrating", stuffCtrl.getBestRatedBooks);

// /api/books    ---> Done
router.post("/", auth, stuffCtrl.createBook);

// /api/books/:id/rating ---> Done
router.post("/:id/rating", auth, stuffCtrl.rateBook);

// PUT /api/books/:id  ---> Done
router.put("/:id", auth, stuffCtrl.modifyBook);

// DELETE /api/books/:id     ---> Done
router.delete("/:id", auth, stuffCtrl.deleteBook);

module.exports = router;
