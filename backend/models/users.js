const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: {
    type: String,
  },
  reportedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likedReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  likedComments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  favoriteSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
