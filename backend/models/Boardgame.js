const mongoose = require("mongoose");

const boardGameSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    required: true,
    enum: ["Available", "Unavailable"],
    default: "Available",
  },
  mainPhoto: String,
  photoGallery: [String],
  tags: [String],
  averageRating: { type: Number, default: 0 },
});

const Boardgame = mongoose.model("Boardgame", boardGameSchema);

module.exports = { Boardgame };
