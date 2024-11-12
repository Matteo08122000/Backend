const mongoose = require("mongoose");
require("dotenv").config();

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);


    console.log("database successfully")
   //const db = mongoose.connection;

   // db.on("error", () => console.log("Error during database connection"));
    //db.once("open", () => console.log("database connection successfully"));
    
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = init;
