const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  songId: {
    type: Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
reviewSchema.index({ songId: 1, userId: 1 }, { unique: true });

reviewSchema.post("save", async function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate review detected for the same song and user."));
  } else {
    next();
  }
});


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
