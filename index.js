const express = require("express");
const mongoose = require("mongoose");
const init = require("./db");
require("dotenv").config();
const useresRoute = require("./routes/users");
const cors = require("cors");
const books = require("./routes/books");
const login = require("./routes/login");
const emailRoute = require("./routes/SendEmail");
const path = require("path");
const commentsRoute = require("./routes/comments");
const githubRoute = require("./routes/github");
const googleRoute = require("./routes/google");
const logoutAuthRoute = require("./routes/logoutAuth");

const PORT = 5040;

const server = express();

server.use("/uploads", express.static(path.join(__dirname, "./uploads")));

server.use(express.json());
server.use(
  cors({
    origin: [
      "https://epicbookfrontend-pdvqvabr6e-matteo08212006-projects.vercel.app",
      "https://epibookfrontend-kbepxq0hr-matteo08122000s-projects.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

server.use("/", useresRoute);
server.use("/", books);
server.use("/", login);
server.use("/", emailRoute);
server.use("/", commentsRoute);
server.use("/", githubRoute);
server.use("/", googleRoute);
server.use("/", logoutAuthRoute);

init();

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
