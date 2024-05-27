const { Review } = require("../models/Review");

// Controller to create a review
const createReview = async (req, res) => {
  const userId = req.id;
  const { gameId } = req.params;
  const { title, description, rating } = req.body;

  try {
    const existingReview = await Review.findOne({
      boardGameId: gameId,
      userId: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        ok: false,
        msg: "Ya has creado una reseña para este juego",
      });
    }

    const newReview = new Review({
      boardGameId: gameId,
      userId,
      title,
      description,
      rating,
    });

    await newReview.save();
    res.status(201).json({
      ok: true,
      msg: "Reseña creada exitosamente",
      review: newReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando reseña",
      error: error.msg,
    });
  }
};

// Controller to get reviews by boardgameId
const getReviews = async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await Review.find({ boardGameId: gameId }).populate(
      "userId",
      "username photo",
    );
    res.json({
      ok: true,
      msg: "Reseñas obtenidas con éxito",
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error obteniendo reseñas",
      error: error.msg,
    });
  }
};

// Controller to get review by ID
const getReviewById = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId).populate(
      "userId",
      "username photo",
    );
    if (!review) {
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada",
      });
    }
    res.json({
      ok: true,
      msg: "Reseña obtenida con éxito",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error obteniendo reseña",
      error: error.msg,
    });
  }
};

// Controller to update a review
const updateReview = async (req, res) => {
  const userId = req.id;
  const { reviewId } = req.params;
  const { title, description, rating } = req.body;

  try {
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada o usuario no autorizado para actualizar esta reseña",
      });
    }
    review.title = title;
    review.description = description;
    review.rating = rating;

    await review.save();
    res.json({
      ok: true,
      msg: "Reseña actualizada exitosamente",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando reseña",
      error: error.msg,
    });
  }
};

// Controller to delete a review
const deleteReview = async (req, res) => {
  const userId = req.id;
  const { reviewId } = req.params;

  try {
    const result = await Review.deleteOne({ _id: reviewId, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada o usuario no autorizado para actualizar esta reseña",
      });
    }
    res.json({
      ok: true,
      msg: "Reseña borrada exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando review",
      error: error.msg,
    });
  }
};

// Controller to get average rating of results
const getAverageRating = async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await Review.find({ boardGameId: gameId });
    if (!reviews.length) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron reseñas para este juego",
      });
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({
      ok: true,
      msg: "Media de calificaciones obtenida exitosamente",
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error obteniendo la media de calificaciones",
      error: error.message,
    });
  }
};

// Controller to check if user has review for a game
const userHasReview = async (req, res) => {
  const userId = req.id;
  const { gameId } = req.params;

  try {
    const existingReview = await Review.findOne({
      boardGameId: gameId,
      userId: userId,
    });

    if (existingReview) {
      return res.status(200).json({
        ok: true,
        hasReview: true,
        msg: "El usuario ya ha creado una reseña para este juego",
        review: existingReview,
      });
    }

    return res.status(200).json({
      ok: false,
      hasReview: false,
      msg: "El usuario no ha creado una reseña para este juego",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error verificando reseña del usuario",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAverageRating,
  getReviewById,
  userHasReview,
};
