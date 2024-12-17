const Comment = require("../models/comments");
const Review = require("../models/review");
const User = require("../models/users");
const ExpressError = require("../utils/ExpressErrors");

// Obtener comentarios de una reseña
module.exports.getComments = async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId).populate({
    path: "comments",
    populate: { path: "userId", select: "-password -favoriteSongs" },
  });

  if (!review) throw new ExpressError(400, "Review not found");

  res.json({ comments: review.comments });
};

// Obtener respuestas de un comentario
module.exports.getNestedComments = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate({
    path: "replies",
    populate: { path: "userId", select: "-password -favoriteSongs" },
  });

  if (!comment) throw new ExpressError(400, "Comment not found");

  res.json({ comments: comment.replies });
};

// Crear comentario para una reseña
module.exports.createComment = async (req, res) => {
  const { reviewId } = req.params;
  const { content } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) throw new ExpressError(400, "Review not found");

  const newComment = new Comment({
    content,
    userId: req.userId,
    reviewId,
  });

  await newComment.save();
  review.comments.push(newComment);
  await review.save();

  res.status(201).json({ newComment, message: "Comment Created" });
};

// Crear respuesta a un comentario
module.exports.createNestedComment = async (req, res) => {
  const { reviewId, commentId } = req.params;
  const { content } = req.body;

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) throw new ExpressError(400, "Comment not found");

  const reply = new Comment({
    content,
    userId: req.userId,
    reviewId,
    parent: commentId,
  });

  await reply.save();
  parentComment.replies.push(reply);
  await parentComment.save();

  res.status(201).json({ reply, message: "Comment Created" });
};

// Borrar comentario y sus respuestas recursivamente
module.exports.deleteCommentAndReplies = async function deleteNested(commentId) {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (comment && comment.replies.length) {
    for (const replyId of comment.replies) {
      await deleteNested(replyId);
    }
  }
};

// Eliminar comentario
module.exports.deleteComment = async (req, res) => {
  const { songId, reviewId, commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ExpressError(400, "Comment not found");

  const userAuthorized =
    req.role === "admin" || req.userId === String(comment.userId._id);

  if (!userAuthorized) throw new ExpressError(403, "Unauthorized to delete comment");

  await this.deleteCommentAndReplies(commentId);

  if (comment.parent) {
    await Comment.findByIdAndUpdate(comment.parent, {
      $pull: { replies: commentId },
    });
  } else {
    await Review.findByIdAndUpdate(reviewId, {
      $pull: { comments: commentId },
    });
  }

  res.status(200).json({ message: "Comment Deleted" });
};

// Manejar "Me gusta" en comentarios
module.exports.likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  const user = await User.findById(userId);
  const alreadyLiked = user.likedComments.includes(commentId);

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    alreadyLiked
      ? { $inc: { likes: -1 }, $pull: { likedBy: userId } }
      : { $inc: { likes: 1 }, $addToSet: { likedBy: userId } },
    { new: true }
  );

  if (!comment) throw new ExpressError(404, "Comment not found");

  await User.findByIdAndUpdate(userId, {
    [alreadyLiked ? "$pull" : "$addToSet"]: { likedComments: commentId },
  });

  res.json({
    message: alreadyLiked
      ? "Comment unliked successfully"
      : "Comment liked successfully",
  });
};
