const mongoose = require("mongoose");

const solutionSchmema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  rank: Number,
  birthPlace: String,
  currentWeatherCelsius: Number,
  restaurant: {
    name: String,
    rating: Number,
  },
});

module.exports = new mongoose.model("solution", solutionSchmema);
