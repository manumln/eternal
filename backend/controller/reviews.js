const Review = require("../models/review");
const User = require("../models/users");
const ExpressError = require("../utils/ExpressErrors");
const { deleteCommentAndReplies } = require("./comments");

// Obtener todas las reseñas asociadas a una canción
module.exports.getAllReviews = async (req, res) => {
  const { id: songId } = req.params;

  try {
    const reviews = await Review.find({ songId }).populate(
      "userId",
      "-password -favoriteSongs"
    );
    res.json({ reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// Obtener la reseña de un usuario para una canción específica
module.exports.getReview = async (req, res) => {
  const { id: songId } = req.params;
  const { userId } = req;

  try {
    const review = await Review.findOne({ songId, userId }).populate(
      "userId",
      "-password -favoriteSongs"
    );
    if (!review) throw new ExpressError(404, "Review not found");
    res.json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching review", error: error.message });
  }
};

// Crear una reseña
module.exports.createReview = async (req, res) => {
  const { id: songId } = req.params;
  const { content, rating } = req.body;
  const { userId } = req;

  try {
    const existingReview = await Review.findOne({ songId, userId });
    if (existingReview)
      return res
        .status(400)
        .json({ message: "Review already exists for this song" });

    const newReview = new Review({ songId, content, rating, userId });
    await newReview.save();
    res
      .status(201)
      .json({ review: newReview, message: "Review created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

module.exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const { userId } = req;

  try {
    const review = await Review.findById(reviewId);
    if (!review) throw new ExpressError(404, "Review not found");
    if (review.userId.toString() !== userId)
      throw new ExpressError(403, "Unauthorized to update this review");

    review.content = content || review.content;
    review.rating = rating || review.rating;

    await review.save();
    res.json({ review, message: "Review updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

// Eliminar una reseña y sus comentarios asociados
module.exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const { userId, role } = req;

  try {
    const review = await Review.findById(reviewId);
    if (!review) throw new ExpressError(404, "Review not found");

    const isAuthorized =
      role === "admin" || review.userId.toString() === userId;
    if (!isAuthorized)
      throw new ExpressError(403, "Unauthorized to delete review");

    // Eliminar la reseña
    await Review.findByIdAndDelete(reviewId);

    // Eliminar los comentarios asociados
    await Promise.all(review.comments.map(deleteCommentAndReplies));

    res.json({
      message: "Review and associated comments deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

// Manejar "Me gusta" en una reseña
module.exports.likeReview = async (req, res) => {
  const { reviewId } = req.params;
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) throw new ExpressError(404, "User not found");

    const isLiked = user.likedReviews.includes(reviewId);
    const updateReview = isLiked
      ? { $inc: { likes: -1 }, $pull: { likedBy: userId } }
      : { $inc: { likes: 1 }, $addToSet: { likedBy: userId } };

    const review = await Review.findByIdAndUpdate(reviewId, updateReview, {
      new: true,
    });
    if (!review) throw new ExpressError(404, "Review not found");

    const updateUser = isLiked
      ? { $pull: { likedReviews: reviewId } }
      : { $addToSet: { likedReviews: reviewId } };

    await User.findByIdAndUpdate(userId, updateUser);
    res.json({
      message: isLiked
        ? "Review unliked successfully"
        : "Review liked successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking review", error: error.message });
  }
};
module.exports.getFollowedReviews = async (req, res) => {
  const { userId } = req;

  try {
    // Obtener el usuario actual junto con la lista de personas que sigue
    const user = await User.findById(userId).populate("following", "_id");

    if (!user) throw new ExpressError(404, "User not found");

    // Obtener los IDs de los usuarios que sigue
    const followingIds = user.following.map((follow) => follow._id);

    // Buscar reviews recientes de los usuarios que sigue
    const reviews = await Review.find({ userId: { $in: followingIds } })
      .populate("userId", "firstName lastName profileImage")
      .populate("songId", "title artist")
      .sort({ createdAt: -1 }) // Ordenar por las más recientes
      .limit(20); // Limitar la cantidad de resultados (opcional)

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching followed reviews", error: error.message });
  }
};