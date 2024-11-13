const express = require("express");
const google = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();

google.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    (accessToken, refreshToken, profile, done) => {
      console.log("DATI DEL UTENTE", profile);
      return done(null, profile);
    }
  )
);

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl);
  }
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.JWT_SECRET);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success/${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

google.get("/success", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/home`);
});

module.exports = google;
