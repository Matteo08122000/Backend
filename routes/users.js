const express = require("express");
const users = express.Router();
const Usermodels = require("../models/Usersmodels");
const VerifyToken = require("../middlewares/VerifyToken");

users.get("/users", VerifyToken, async (req, res, next) => {
  try {
    const users = await Usermodels.find();
    if (users.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Users not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      users,
    });
  } catch (err) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

users.post("/users/create", async (req, res, next) => {
  const { name, surname, email, dob, password, address } = req.body;

  if (!name || !surname || !email || !dob || !password) {
    return res
      .status(400)
      .json({ message: "Tutti i campi obbligatori devono essere compilati." });
  }

  const newUser = new Usermodels({
    name: name,
    surname: surname,
    email: email,
    dob: dob,
    password: password,
    address: address,
  });

  try {
    const user = await newUser.save();
    res.status(201).send({
      statusCode: 201,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

users.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }
  try {
    const user = await Usermodels.findById(userId);
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User ID not Found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

users.patch("/users/update/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  const userExist = await Usermodels.findById(userId);

  if (!userExist) {
    return res.status(404).send({
      statusCode: 404,
      message: "User not found",
    });
  }
  try {
    const dataToUpdate = req.body;
    const options = { new: true };
    const result = await Usermodels.findByIdAndUpdate(
      userId,
      dataToUpdate,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "User updated successfully",
      result,
    });
  } catch {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

users.delete("/users/delete/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  const userExist = await Usermodels.findById(userId);

  if (!userExist) {
    return res.status(404).send({
      statusCode: 404,
      message: "User not found",
    });
  }

  try {
    const user = await Usermodels.findByIdAndDelete(userId);
    res.status(200).send({
      statusCode: 200,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

users.get("/users/by-email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await Usermodels.findOne({ email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).send({
      statusCode: 200,
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Oops, something went wrong",
    });
  }
});

module.exports = users;
