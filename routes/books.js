const express = require("express");
const books = express.Router();
const BooksModel = require("../models/Bookmodel");
const isArrayEmpty = require("../utilies/checkArrayLength");
const validateBook = require("../middlewares/validateBooks");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const upload = require("../middlewares/internalStorage");
const cloud = require("../middlewares/cloudStorage");
const VerifyToken = require("../middlewares/VerifyToken");

books.post("/books/upload", upload.single("img"), async (req, res, next) => {
  try {
    const url = `${req.protocol}://${req.get("host")}`;
    const imgUrl = req.file.filename;
    res.status(200).json({ img: `${url}/uploads/${imgUrl}` });
  } catch (error) {
    next(error);
  }
});

books.post(
  "/books/upload/cloud",
  cloud.single("img"),
  async (req, res, next) => {
    console.log("cloudinary", process.env.CLOUDINARY_CLOUD_NAME);
    try {
      res.status(200).json({ img: req.file.path });
    } catch (e) {
      next(e);
    }
  }
);

books.get("/books", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const books = await BooksModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const count = await BooksModel.countDocuments();
    const totalPages = Math.ceil(count / pageSize);

    if (books.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No books found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Books found: ${books.length}`,
      count,
      totalPages,
      books,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

books.post("/books/create", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
   const newbook = new BooksModel(req.body);
   await newbook.save();
    

    res.status(200).send({
      statusCode: 200,
      message: "Books created successfully",
     
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

books.get("/books/search", async (req, res) => {
  const { title } = req.query;
  console.log("Received search query:", title);

  try {
    let query = {};
    if (title) {
      query = { title: { $regex: title, $options: "i" } };
    }

    const books = await BooksModel.find(query);
    console.log("Books found:", books);

    if (books.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No books found with this title",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Books found: ${books.length}`,
      count: books.length,
      totalPages: Math.ceil(books.length / 10),
      books,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

books.get("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksModel.findById(id);

    if (!book) {
      return res.status(404).send({
        statusCode: 404,
        message: "Libro non trovato",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Libro trovato con successo",
      book,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

books.patch("/books/:id", [validateBook], async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!book) {
      return res.status(404).send({
        statusCode: 404,
        message: "Libro non trovato",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Libro aggiornato con successo",
      book,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

books.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BooksModel.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).send({
        statusCode: 404,
        message: "Libro non trovato",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Libro eliminato con successo",
      book,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

books.patch("/books/updateModel", async (req, res, next) => {
  await BooksModel.updateMany(
    { comments: { $exists: false } },
    { $set: { comments: [] } }
  );
});

module.exports = books;
