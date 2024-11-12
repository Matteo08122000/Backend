const express = require("express");
const comments = express.Router();
const BooksModel = require("../models/Bookmodel");
const Usersmodels = require("../models/Usersmodels");
const CommentsModel = require("../models/CommentsModel");
const mongoose = require("mongoose");

comments.get("/comments/book/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const bookId = new mongoose.Types.ObjectId(id);
    const comments = await CommentsModel.find({ book: bookId }).populate(
      "user"
    );
    if (comments.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Comments not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Comments found",
      comments,
    });
  } catch (error) {
    next(error);
  }
});

comments.get("/comments", async (req, res, next) => {
  try {
    const comments = await CommentsModel.find().populate("user book");
    res.status(200).send({
      statusCode: 200,
      message: "comments found",
      comments,
    });
  } catch (error) {
    next(error);
  }
});

comments.post("/comments/create", async (req, res, next) => {
  const { rate, comment, user: userId, book: bookId } = req.body;
  try {
    const user = await Usersmodels.findById(userId);
    const book = await BooksModel.findById(bookId);

    if (!user || !book) {
      return res.status(404).send({
        statusCode: 404,
        message: "User or Book not found",
      });
    }

    const newComment = new CommentsModel({
      rate,
      comment,
      user: user._id,
      book: book._id,
    });

    const savedComment = await newComment.save();
    await BooksModel.updateOne(
      { _id: book._id },
      { $push: { comments: savedComment._id } }
    );
    res.status(201).send({
      statusCode: 201,
      message: "Comment created successfully",
      comment: savedComment,
    });
  } catch (error) {
    next(error);
  }
});

comments.patch("/comments/:id", async (req, res, next) => {
  const { id } = req.params;
  const { rate, comment } = req.body;

  try {
    const updatedComment = await CommentsModel.findByIdAndUpdate(
      id,
      { rate, comment },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).send({
        statusCode: 404,
        message: "Commento non trovato",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Commento aggiornato con successo",
      updatedComment,
    });
  } catch (error) {
    next(error);
  }
});

comments.delete("/comments/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedComment = await CommentsModel.deleteOne({ _id: id });
    if (deletedComment.deletedCount === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Commento non trovato",
      });
    }

    await BooksModel.updateOne(
      { _id: deletedComment.book },
      { $pull: { comments: id } }
    );

    res.status(200).send({
      statusCode: 200,
      message: "Commento eliminato con successo",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = comments;
