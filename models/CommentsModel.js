const mongoose = require("mongoose");

const CommentsModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usersmodels",
    },
    rate: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BooksModel",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model(
  "CommentsModel",
  CommentsModelSchema,
  "comments"
);
