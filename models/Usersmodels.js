const mongoose = require("mongoose");
const allowedGenders = ["M", "F", "not specified"];
const bycript = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
      required: true,
    },
    surname: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    gender: {
      type: String,
      required: false,
      default: "not specified",
      enum: allowedGenders,
    },
    address: {
      type: String,
      required: false,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BooksModel",
      },
    ],
  },

  { timestamps: true, strict: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bycript.genSalt(10);
    user.password = await bycript.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Usersmodels", UserSchema, "users");
