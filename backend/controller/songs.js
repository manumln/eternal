const Song = require("../models/songs");
const Review = require("../models/review");
const User = require("../models/users");
const ExpressError = require("../utils/ExpressErrors");
const { deleteCommentAndReplies } = require("./comments");

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

module.exports.getAllSongs = async (req, res) => {
  const { q, page = 1, limit = process.env.DEFAULT_LIMIT || 10 } = req.query;
  const skip = (page - 1) * limit;

  let filter = {};
  if (q) {
    const searchWords = q.split(" ");
    const regex = new RegExp(searchWords.join("|"), "i");
    filter = { $or: [{ title: regex }, { artist: regex }] };
  }

  const [songs, totalSongs] = await Promise.all([
    Song.find(filter).skip(skip).limit(limit),
    Song.countDocuments(filter),
  ]);

  res.json({
    songs,
    totalSongs,
    totalPages: Math.ceil(totalSongs / limit),
  });
};

module.exports.getSong = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    throw new ExpressError(404, "Song not found");
  }
  res.json({ song });
};

module.exports.createSong = async (req, res) => {
  const { role } = req;
  if (role !== "admin") {
    throw new ExpressError(401, "You are not Authorized to Add Song");
  }
  
  const body = req.body;
  if (req.file) {
    let url = req.file.path;
    body.image_url = url.startsWith("public") ? `${BASE_URL}/${url}` : url;
  }

  const song = new Song(body);
  await song.save();

  res.json({ song, message: `New Song: ${song.title} Added` });
};

module.exports.deleteSong = async (req, res) => {
  const { role } = req;
  if (role !== "admin") {
    throw new ExpressError(401, "You are not Authorized to Delete a Song");
  }
  
  const id = req.params.id;
  const song = await Song.findByIdAndDelete(id);
  if (!song) {
    throw new ExpressError(404, "Song not found");
  }

  const usersWithSong = await User.find({ favoriteSongs: { $in: [id] } });
  await Promise.all(
    usersWithSong.map(user =>
      User.updateOne({ _id: user._id }, { $pull: { favoriteSongs: id } })
    )
  );

  const reviews = await Review.find({ songId: song._id });
  await Promise.all(
    reviews.map(async review => {
      await Review.findByIdAndDelete(review._id);
      for (const replyId of review.comments) {
        await deleteCommentAndReplies(replyId);
      }
    })
  );

  res.json({ song, message: `Song Deleted: ${song.title}` });
};

module.exports.updateSong = async (req, res) => {
  const { role } = req;
  if (role !== "admin") {
    throw new ExpressError(401, "You are not Authorized to Update a Song");
  }

  const id = req.params.id;
  const body = req.body;

  const previous = await Song.findById(id);
  if (!previous) {
    throw new ExpressError(404, "Song not found");
  }

  if (req.file) {
    let url = req.file.path;
    body.image_url = url.startsWith("public") ? `${BASE_URL}/${url}` : url;
  } else {
    body.image_url = previous.image_url;
  }

  const current = await Song.findByIdAndUpdate(id, body, { new: true });

  res.json({ previous, current, message: `Song Updated` });
};
