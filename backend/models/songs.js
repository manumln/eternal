const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Evita duplicados
  },
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
  album: {
    type: String,
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
