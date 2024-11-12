const multer = require("multer");
const path = require("path");
const fileFilter = require("./FileFilter");

const uploadInternalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

const upload = multer({
  storage: uploadInternalStorage,
  fileFilter: fileFilter,
});

module.exports = upload;
