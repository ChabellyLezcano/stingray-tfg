const { Recommendation } = require("../models/Recommendation");
const { Review } = require("../models/Review"); // Asumiendo que tienes un modelo Review
const {
  shuffleArray,
  getUserFavoriteTags,
  getGamesByTags,
  calculateAffinityScore,
} = require("../helpers/recommendationUtils");
const { User } = require("../models/User");

// Controller to generate or update recommendations
const generateRecommendations = async (req, res) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "User") {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para ver recomendaciones",
      });
    }

    const favoriteTags = await getUserFavoriteTags(userId);
    let recommendedGames = await getGamesByTags(favoriteTags);

    // Calculate affinity and sort games by their affinity score
    recommendedGames = recommendedGames
      .map((game) => ({
        game,
        affinityScore: calculateAffinityScore(game, favoriteTags),
      }))
      .sort((a, b) => b.affinityScore - a.affinityScore)
      .slice(0, 40);

    // Shuffle the 40 games with the highest affinity and select 5 at random
    shuffleArray(recommendedGames);
    const selectedGames = recommendedGames.slice(0, 5);

    let recommendation = await Recommendation.findOne({ userId });

    if (!recommendation) {
      recommendation = new Recommendation({
        userId,
        recommendations: [],
      });
    }

    // Update the recommendations with the selected games
    recommendation.recommendations = selectedGames.map(({ game }) => ({
      boardGameId: game._id,
      affinityScore: calculateAffinityScore(game, favoriteTags),
    }));

    await recommendation.save();

    // Populate the boardGame details for each recommendation after saving
    recommendation = await Recommendation.findOne({ userId }).populate({
      path: "recommendations.boardGameId",
      model: "Boardgame",
    });

    res.json(recommendation);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res
      .status(500)
      .send({ error: "Error retrieving or updating recommendations" });
  }
};

module.exports = { generateRecommendations };
