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

// a user can follow another user at most once
followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
