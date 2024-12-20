const express = require("express");
const genreController = require("../controller/genres");
const asyncHandler = require("express-async-handler");

const router = express.Router();

// Define the genres route
router.route("/").get(asyncHandler(genreController.getGenres));

module.exports = router;
