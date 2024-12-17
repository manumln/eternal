const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  signup,
  login,
  getAllUsers,
  getFavouriteSongs,
  toggleFavouriteSong,
  getMe,
  reportUser,
  getUser,
  updateUser,
  getUserReviews,
  toggleFollowUser
} = require("../controller/users");
const { authorization } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFollowedReviews } = require("../controller/reviews");

router.get("/", authorization, asyncHandler(getAllUsers));

router.post("/signup", asyncHandler(signup));

router.post("/login", asyncHandler(login));

router
  .route("/favourites")
  .get(authorization, asyncHandler(getFavouriteSongs))
  .put(authorization, asyncHandler(toggleFavouriteSong));

router.get("/me", authorization, asyncHandler(getMe));

router.get("/:userId", getUser);

router.put("/:userId/edit", authorization, upload.single("profileImage"), asyncHandler(updateUser));

router.get("/:userId/reviews", asyncHandler(getUserReviews));

router.put("/:userId/follow", authorization, asyncHandler(toggleFollowUser));

router.get("/followed-reviews", authorization, asyncHandler(getFollowedReviews));


module.exports = router;
