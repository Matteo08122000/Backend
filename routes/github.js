const express = require("express");
const github = express.Router();
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
const session = require("express-session");
const gitHubuser = require("../models/OAuthModel");
require("dotenv").config();

// Configurazione della sessione
github.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

github.use(passport.initialize());
github.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("Dati utente", profile);

    
github.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res, next) => {
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl);
  }
);

github.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res, next) => {
    const user = req.user;

    //  informazioni necessarie dell'utente
    const userPayload = {
      githubId: user.githubId,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success/${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

github.get("/success", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/home`);
});

module.exports = github;
