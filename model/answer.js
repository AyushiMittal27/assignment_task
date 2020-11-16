const mongoose = require("mongoose");
const solution = require("./solution");

const answerSchema = new mongoose.Schema({
  ans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solution",
    },
  ],
});

module.exports = new mongoose.model("answer", answerSchema);
