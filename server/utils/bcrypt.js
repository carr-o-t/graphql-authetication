const bcrypt = require("bcrypt");

const saltRounds = 10; // Adjust salt rounds as needed (higher for stronger hashing)

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (password, hashedPassword) => {
  console.log("compare");
  const res = await bcrypt.compare(password, hashedPassword);
  console.log("COMPARE PASS ::: ", res);
  return res;
};

module.exports = { hashPassword, comparePasswords };
