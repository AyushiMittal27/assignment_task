const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser");
const {
  findTopThree,
  getWeather,
  getNearByRestaurdant,
} = require("./controller");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post(
  "/",
  (req, res, next) => {
    console.log("request Received");
    next();
  },
  findTopThree,
  getWeather,
  getNearByRestaurdant
);
mongoose.connect("mongodb://localhost:27017/mySolution", () => {
  console.log("Mongoose Connected");
});

app.listen(5410, () => {
  console.log("Server is up on port 5410");
});
