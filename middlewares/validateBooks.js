const { body, validationResult } = require("express-validator");

const validateBook = [
  body("asin").isString().notEmpty().withMessage("Asin is not valid"),
  body("title").isString().notEmpty().withMessage("Title is not valid"),
  body("img").isString().notEmpty().withMessage("Image is not valid"),
  body("price").isDecimal().withMessage("Price is not valid"),
  body("category").isString().notEmpty().withMessage("Category is not valid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        statusCode: 400,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateBook;
