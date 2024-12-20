const Genre = require("../models/genre");
const ExpressError = require("../utils/ExpressErrors");

module.exports.getGenres = async (req, res) => {
    try {
      console.log("Fetching genres..."); // Log the request
      const genres = await Genre.find();
      res.json({ genres });
    } catch (error) {
      console.error("Error fetching genres:", error); // Log the error
      throw new ExpressError(500, "Error fetching genres");
    }
  };
  