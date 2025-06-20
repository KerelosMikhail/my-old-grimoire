const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/stuff");

// Array of books /api/books    ---> Done
router.get("/", stuffCtrl.getAllBooks);

// Single book /api/books/:id     ---> Done
router.get("/:id", stuffCtrl.getBookById);

// Array of books /api/books/bestrating     ---> Done
router.get("/bestrating", stuffCtrl.getBestRatedBooks);

// /api/books    ---> Done --> need work
router.post("/", stuffCtrl.createBook);

// /api/books/:id/rating
router.post("/:id/rating", stuffCtrl.rateBook);

// PUT /api/books/:id  ---> Done   --> need work
router.put("/:id", stuffCtrl.modifyBook);

// DELETE /api/books/:id     ---> Done   --> need work
router.delete("/:id", stuffCtrl.deleteBook);

module.exports = router;
