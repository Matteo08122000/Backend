const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sendEmail = express.Router();

sendEmail.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "waino.marvin@ethereal.email",
    pass: "4wYxfRpJfBdpdKRzbf",
  },
});

sendEmail.post("/SendEmail", async (req, res) => {
  const { recipient, subject, text } = req.body;

  const mailOptions = {
    from: "matteo.dinnocenzo@matt.com",
    to: recipient,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email inviata con successo:", info.response);
    res.status(200).send({
      statusCode: 200,
      message: "Email inviata con successo.",
    });
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    res.status(500).send({
      statusCode: 500,
      message: "Errore durante l'invio dell'email.",
    });
  }
});

module.exports = sendEmail;
