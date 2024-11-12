const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return res.status(401).send({
      statusCode: 401,
      message: "token not valid",
    });
  }
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    next();
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      message: "token not valid",
    });
  }
};
