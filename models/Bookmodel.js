const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["horror", "fantasy", "scifi", "romance", "history"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommentsModel",
      },
    ],
  },
  { timestamps: true, strict: true }
);

BookSchema.index({ title: "text" });
module.exports = mongoose.model("BooksModel", BookSchema, "books");
