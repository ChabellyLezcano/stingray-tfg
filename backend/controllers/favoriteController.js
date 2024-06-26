const { Favorite } = require("../models/Favorite");
const { Boardgame } = require("../models/Boardgame");

// Controller to add boardgame to favorites
const addGameToFavorites = async (req, res) => {
  const { gameId } = req.params;
  const userId = req.id;

  try {
    const game = await Boardgame.findById(gameId);
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      // Si no existe una lista de favoritos, crea una nueva
      const newFavorite = new Favorite({ userId, boardGames: [gameId] });
      await newFavorite.save();
      return res.status(201).json({
        ok: true,
        msg: "Favoritos creados y juego agregado",
        favorites: newFavorite,
      });
    }

    // If the boardgame is already in favorites, not add it
    if (favorite.boardGames.includes(gameId)) {
      return res.status(400).json({
        ok: false,
        msg: "El juego ya está en tus favoritos",
      });
    }

    // Agregar el juego a la lista de favoritos existente
    favorite.boardGames.push(gameId);
    await favorite.save();

    res.json({
      ok: true,
      msg: "Juego agregado a favoritos",
      favorites: favorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al agregar juego a favoritos",
    });
  }
};

// Controller to remove a boardgame from favorites
const removeGameFromFavorites = async (req, res) => {
  const { gameId } = req.params;
  const userId = req.id;

  try {
    const game = await Boardgame.findById(gameId);
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron favoritos para este usuario",
      });
    }

    const gameIndex = favorite.boardGames.indexOf(gameId);
    if (gameIndex === -1) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado en favoritos",
      });
    }

    // Remove the game from the favorites array
    favorite.boardGames.splice(gameIndex, 1);
    await favorite.save();

    res.json({
      ok: true,
      msg: "Juego eliminado de favoritos",
      favorites: favorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar juego de favoritos",
    });
  }
};

// Controller to list favorite boardgames
const listFavorites = async (req, res) => {
  const userId = req.id;

  try {
    const favorite = await Favorite.findOne({ userId }).populate("boardGames");
    if (!favorite) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron favoritos para este usuario",
      });
    }

    res.json({
      ok: true,
      message: "Favoritos recuperados con éxito",
      favorites: favorite.boardGames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error al recuperar los juegos favoritos",
    });
  }
};

// Check if a game is favorite
const isGameFavorite = async (req, res) => {
  const { gameId } = req.params;
  const userId = req.id;

  try {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite || !favorite.boardGames.includes(gameId)) {
      return res.json({
        ok: false,
        msg: "El juego no está en tus favoritos",
      });
    }

    res.json({
      ok: true,
      msg: "El juego está en tus favoritos",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al comprobar si el juego está en favoritos",
    });
  }
};

module.exports = {
  addGameToFavorites,
  removeGameFromFavorites,
  listFavorites,
  isGameFavorite,
};
