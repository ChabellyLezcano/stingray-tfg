const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boardGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Boardgame" }],
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = { Favorite };
