const express = require("express");
const logoutAuth = express.Router();

logoutAuth.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({
        statusCode: 500,
        message: "Oops, something went wrong",
        err,
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({
          statusCode: 500,
          message: "Failed to destroy session",
          err,
        });
      }

      res.redirect("/");
    });
  });
});

module.exports = logoutAuth;
