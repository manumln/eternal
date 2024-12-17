const express = require("express");
const songController = require("../controller/songs.js");
console.log("songController:", songController);
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
} = require("../controller/reviews.js");

const {
  getComments,
  createComment,
  createNestedComment,
  deleteComment,
  getNestedComments,
  likeComment,
} = require("../controller/comments.js");

router
  .route("/")
  .get(asyncHandler(songController.getAllSongs))
  .post(
    authorization,
    upload.single("image"),
    asyncHandler(songController.createSong)
  );

router
  .route("/:id")
  .get(asyncHandler(songController.getSong))
  .put(
    authorization,
    upload.single("image"),
    asyncHandler(songController.updateSong)
  )
  .delete(authorization, asyncHandler(songController.deleteSong));

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

module.exports = router;
