const ExpressError = require("../utils/ExpressErrors");
const bcrypt = require("bcryptjs");
const { SignJWT } = require("jose");
const User = require("../models/users");
const Song = require("../models/songs");
const Review = require("../models/review");

const handleError = (res, error, message = "Server error") => {
  res.status(error.statusCode || 500).json({ message, error: error.message });
};

const findUserById = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ExpressError(404, "User not found");
    return user;
  } catch (error) {
    handleError(res, error, "Error fetching user data");
    return null;
  }
};

const validateSongExistence = async (songId, res) => {
  try {
    const song = await Song.findById(songId);
    if (!song) throw new ExpressError(404, "Song not found");
    return song;
  } catch (error) {
    handleError(res, error, "Error fetching song data");
    return null;
  }
};

const validateUserAuthorization = (req, res, userId) => {
  const { role, userId: currentUserId } = req;
  if (role !== "admin" && currentUserId !== userId) {
    return handleError(res, new ExpressError(401, "Not authorized"));
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ExpressError(400, "Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, ...rest });
    await newUser.save();

    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ExpressError(400, "Invalid email or password");
    }

    const payload = { id: user._id, role: user.role };
    const secretBytes = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(secretBytes);

    res.status(200).json({ token, role: user.role, message: `Welcome ${user.firstName}!` });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports.getAllUsers = async (req, res) => {
  if (req.role !== "admin") return handleError(res, new ExpressError(401, "Not Authorized"));

  try {
    const users = await User.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    handleError(res, error, "Error fetching users");
  }
};

module.exports.reportUser = async (req, res) => {
  try {
    const userId = req.userId;
    const susId = req.params.userId;

    await User.findByIdAndUpdate(susId, { $addToSet: { reportedBy: userId } });
    res.status(200).json({ message: "User successfully reported" });
  } catch (error) {
    handleError(res, error, "Error reporting user");
  }
};

module.exports.toggleFavouriteSong = async (req, res) => {
  const { songId } = req.body;
  if (!songId) return handleError(res, new ExpressError(400, "Song ID is required"));

  try {
    const user = await findUserById(req.userId, res);
    if (!user) return;

    const song = await validateSongExistence(songId, res);
    if (!song) return;

    const isFavorite = user.favoriteSongs.includes(songId);
    if (isFavorite) user.favoriteSongs.pull(songId);
    else user.favoriteSongs.push(songId);

    await user.save();
    const responseMessage = isFavorite ? "Song removed from favorites" : "Song added to favorites";
    res.status(200).json({ message: responseMessage, song });
  } catch (error) {
    handleError(res, error, "Error toggling favorite song");
  }
};

module.exports.getFavouriteSongs = async (req, res) => {
  try {
    const user = await findUserById(req.userId, res);
    if (!user) return;

    await user.populate("favoriteSongs");
    res.status(200).json({ songs: user.favoriteSongs });
  } catch (error) {
    handleError(res, error, "Error fetching favorite songs");
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const user = await findUserById(req.userId, res);
    if (!user) return;

    res.status(200).json({ user });
  } catch (error) {
    handleError(res, error, "Error fetching user data");
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await findUserById(userId, res);
    if (!user) return;

    res.status(200).json({ user });
  } catch (error) {
    handleError(res, error, "Error fetching user");
  }
};

module.exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  validateUserAuthorization(req, res, userId);

  try {
    const updatedData = { ...req.body };
    if (req.file) updatedData.profileImage = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports.getUserReviews = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await Review.find({ userId }).populate("songId");
    res.status(200).json({ reviews });
  } catch (error) {
    handleError(res, error, "Error fetching user reviews");
  }
};

module.exports.toggleFollowUser = async (req, res) => {
  const { userId: targetUserId } = req.params; // Usuario a seguir
  const currentUserId = req.userId; // Usuario que realiza la acción

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) throw new ExpressError(404, "User to follow not found");

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    const message = isFollowing ? "User unfollowed" : "User followed";
    res.status(200).json({ message, following: currentUser.following, followers: targetUser.followers });
  } catch (error) {
    handleError(res, error, "Error toggling follow status");
  }
};

