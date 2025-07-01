const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Book = require("./models/book");

// Read and parse the JSON file
const dataPath = path.join(__dirname, "../frontend/public/data/data.json");
const books = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Convert "id" to "_id" and remove if present (MongoDB will auto-generate _id)
const booksToInsert = books.map(({ id, ...rest }) => rest);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    // console.log("Connected to MongoDB. Seeding data...");
    await Book.deleteMany({}); // Optional: clear existing books
    await Book.insertMany(booksToInsert);
    // console.log("Database seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
