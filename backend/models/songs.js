const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  artist: {
    type: String,
    required: true,
    minlength: 3,
  },
  image_url: {
    type: String,
  },
  preview: {
    type: String,
  },
  genres: {
    type: [String], 
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
