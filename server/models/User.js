const mongoose = require("mongoose");
const { isEmail, isAlphanumeric } = require("validator"); // For basic validation

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  followerCount: {
    type: Number,
    required: false,
    default: 0
  },
  followingCount: {
    type: Number,
    required: false,
    default: 0
  },
  firstName: {
    type: String,
    required: true,
    trim: true, // Remove leading/trailing whitespace
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length (adjust as needed)
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (username) => isAlphanumeric(username),
      message: "Username must be alphanumeric",
    },
  },
  token: {
    type: String,
  },
  // Add follow count and other fields if needed
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model("User", userSchema);
