const jwt = require("jsonwebtoken");

const generateToken = (userId, email, expiresIn = "1h") => {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn,
  });
  return { token, expiresIn };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
