const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const isValidType = allowedTypes.includes(file.mimetype);
  const isValidExtension =
    file.originalname.endsWith(".png") ||
    file.originalname.endsWith(".jpg") ||
    file.originalname.endsWith(".jpeg") ||
    file.originalname.endsWith(".gif");

  if (isValidType && isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, .gif files are allowed!"), false);
  }
};
module.exports = fileFilter;
