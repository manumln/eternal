const Song = require("../models/songs");
const Review = require("../models/review");
const User = require("../models/users");
const ExpressError = require("../utils/ExpressErrors");
const { deleteCommentAndReplies } = require("./comments");
const { searchSongsOnSpotify } = require("../utils/spotify");

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

module.exports.getAllSongs = async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const offset = (page - 1) * limit;

  try {
    const data = await searchSongsOnSpotify(q, limit, offset);
    const songs = data.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(", "),
      image_url: track.album.images[0]?.url,
      preview: track.preview_url,
      album: track.album.name,
    }));

    res.json({
      songs,
      totalSongs: data.total,
      totalPages: Math.ceil(data.total / limit),
    });
  } catch (error) {
    console.error("Error fetching songs from Spotify:", error.message);
    res.status(500).json({ error: "Failed to fetch songs from Spotify" });
  }
};

module.exports.getSong = async (req, res) => {
  const song = await Song.findOne({ id: req.params.id });  // Buscar por 'id' en lugar de '_id'
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

  if (!body.genres || body.genres.length === 0) {
    throw new ExpressError(400, "Genres are required");
  }

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

module.exports.saveSong = async (req, res) => {
  const { id, title, artist, image_url, preview, album } = req.body;

  if (!id || !title || !artist) {
    return res.status(400).json({ error: "ID, title, and artist are required" });
  }

  try {
    // Verifica si la canción ya está en la base de datos
    let song = await Song.findOne({ id });  // Busca usando 'id' en lugar de '_id'
    if (!song) {
      // Si no existe, crea una nueva canción
      song = new Song({
        id,  // Usa 'id' como el campo del identificador
        title,
        artist,
        image_url,
        preview,
        album
      });
      await song.save();
    }

    res.json({ song, message: "Song saved successfully!" });
  } catch (error) {
    console.error("Error saving song:", error.message);
    res.status(500).json({ error: "Failed to save song" });
  }
};

