const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  followerId: {
    type: String,
    required: true,
  },
  followeeId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Follow", followSchema);
