const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendations: [
    {
      boardGameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Boardgame",
        required: true,
      },
      affinityScore: { type: Number, required: true },
    },
  ],
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = { Recommendation };
