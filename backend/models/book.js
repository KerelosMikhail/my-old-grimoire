const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
  userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5, default: 0 },
    },
  ],

  averageRating: { type: Number, default: 0, min: 0, max: 5 },
});

// In backend/models/book.js
bookSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Book", bookSchema);

