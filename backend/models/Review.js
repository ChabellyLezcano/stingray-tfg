const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  boardGameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoardGame",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  reviewDate: { type: Date, default: Date.now },
  rating: { type: Number, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
