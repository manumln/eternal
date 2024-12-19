const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
  },
});

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
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: false,
  },
});

const Genre = mongoose.model("Genre", genreSchema);
const Song = mongoose.model("Song", songSchema);

module.exports = { Song, Genre };
