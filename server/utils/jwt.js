const jwt = require("jsonwebtoken");

const generateToken = (userId, email, expiresIn = "1h") => {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn,
  });
  return { token, expiresIn };
};

const verifyToken = (token) => {
  // throw TokenExpiredError/JsonWebTokenError for invalid tokens
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
