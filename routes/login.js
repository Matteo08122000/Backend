const express = require("express");
const login = express.Router();
const UsersModel = require("../models/Usersmodels");
const mytoken = require("../Token/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

login.post("/login", async (req, res, next) => {
  try {
    const user = await UsersModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "Utente non trovato con l'email fornita",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).send({
        statusCode: 401,
        message: "Password or email is not valid",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        surname: user.surname,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        dob: user.dob,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.header("Authorization", token).status(200).send({
      statusCode: 200,
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = login;
