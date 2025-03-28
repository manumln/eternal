const express = require("express");
const songController = require("../controller/songs.js");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { authorization } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  getReview,
  getRecentReviews,
} = require("../controller/reviews.js");

const genreController = require("../controller/genres.js"); // Import the genre controller

const {
  getComments,
  createComment,
  createNestedComment,
  deleteComment,
  getNestedComments,
  likeComment,
} = require("../controller/comments.js");

router.get("/recent", asyncHandler(getRecentReviews));


// Routes for songs
router
  .route("/")
  .get(asyncHandler(songController.getAllSongs))
  .post(
    authorization,
    upload.single("image"),
    asyncHandler(songController.createSong)
  );

  router.route("/:id").get(asyncHandler(songController.getSong));

// Routes for reviews
router
  .route("/:id/reviews")
  .get(asyncHandler(getAllReviews))
  .post(authorization, asyncHandler(createReview));

router.route("/:id/reviews/me").get(authorization, asyncHandler(getReview));

router
  .route("/:id/reviews/:reviewId/like")
  .post(authorization, asyncHandler(likeReview));

router
  .route("/:id/reviews/:reviewId")
  .put(authorization, asyncHandler(updateReview))
  .delete(authorization, asyncHandler(deleteReview));

// Routes for comments on reviews
router
  .route("/:songId/reviews/:reviewId/comments")
  .get(asyncHandler(getComments))
  .post(authorization, asyncHandler(createComment));

router
  .route("/:songId/reviews/:reviewId/comments/:commentId")
  .get(asyncHandler(getNestedComments))
  .post(authorization, asyncHandler(createNestedComment))
  .delete(authorization, asyncHandler(deleteComment));

router
  .route("/:id/reviews/:reviewId/comments/:commentId/like")
  .post(authorization, asyncHandler(likeComment));

  router.post("/:id/save", authorization, asyncHandler(songController.saveSong));

module.exports = router;
