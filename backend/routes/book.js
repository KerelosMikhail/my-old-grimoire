const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

// Array of books /api/books    
router.get("/", bookCtrl.getAllBooks);

// Array of books /api/books/bestrating     
router.get("/bestrating", bookCtrl.getBestRatedBooks);

// Single book /api/books/:id    
router.get("/:id", bookCtrl.getBookById);

// /api/books    
router.post("/", auth, multer, bookCtrl.createBook);

// /api/books/:id/rating 
router.post("/:id/rating", auth, bookCtrl.rateBook);

// PUT /api/books/:id  
router.put("/:id", auth, multer, bookCtrl.modifyBook);

// DELETE /api/books/:id    
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
