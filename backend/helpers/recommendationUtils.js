const { Reservation } = require("../models/Reservation");
const { Review } = require("../models/Review");
const { Favorite } = require("../models/Favorite");
const { Boardgame } = require("../models/Boardgame");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getUserFavoriteTags(userId) {
  const reservationIds = await Reservation.find({ userId }).distinct(
    "boardGameId",
  );
  const reviewIds = await Review.find({
    userId,
    rating: { $gt: 3 },
  }).distinct("boardGameId");
  const favoriteIds = await Favorite.find({ userId }).distinct("boardGameId");
  const allGameIds = [
    ...new Set([...reservationIds, ...reviewIds, ...favoriteIds]),
  ];

  const games = await Boardgame.find({ _id: { $in: allGameIds } });

  const tagCount = {};
  games.forEach((game) => {
    game.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const favoriteTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map((item) => item[0]);

  return favoriteTags;
}

async function getGamesByTags(tags) {
  return await Boardgame.find({ tags: { $in: tags } }).limit(40);
}

function calculateAffinityScore(game, userTags) {
  const matchingTagsCount = game.tags.filter((tag) =>
    userTags.includes(tag),
  ).length;
  const totalPossibleTags = Math.min(game.tags.length, userTags.length);
  const affinityPercentage = matchingTagsCount / totalPossibleTags;

  return affinityPercentage;
}

module.exports = {
  shuffleArray,
  getUserFavoriteTags,
  getGamesByTags,
  calculateAffinityScore,
};
