const { Review } = require("../models/Review");

// Create a new review
const createReview = async (req, res) => {
  const userId = req.id;
  const { gameId } = req.params;
  const { title, description, rating } = req.body;

  try {
    const existingReview = await Review.findOne({
      boardGameId: gameId,
      userId: userId,
    });

    // If review exists, return an error message
    if (existingReview) {
      return res.status(400).json({
        ok: false,
        msg: "Ya has creado una reseña para este juego",
      });
    }
    // Create a new review if no existing review is found
    const newReview = new Review({
      boardGameId: gameId,
      userId,
      title,
      description,
      rating,
    });

    // Save the new review to the database
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

// Get reviews by BoardGame ID
const getReviews = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Find all reviews for the specified game and populate user details
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

// Get review by ID
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

// Update a review
const updateReview = async (req, res) => {
  const userId = req.id;
  const { reviewId } = req.params;
  const { title, description, rating } = req.body;

  try {
    // Find the review by ID and user ID to ensure ownership
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      // If no review is found, return an error
      return res.status(404).json({
        ok: false,
        msg: "Reseña no encontrada o usuario no autorizado para actualizar esta reseña",
      });
    }
    // Update review details
    review.title = title;
    review.description = description;
    review.rating = rating;

    // Save the updated review
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

// Delete a review
const deleteReview = async (req, res) => {
  const userId = req.id;
  const { reviewId } = req.params;

  try {
    // Attempt to delete the review, ensuring it belongs to the user
    const result = await Review.deleteOne({ _id: reviewId, userId });
    if (result.deletedCount === 0) {
      // If no review is deleted, it either doesn't exist or the user is unauthorized
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

// Average rating of results
const getAverageRating = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Retrieve all reviews for the specified game
    const reviews = await Review.find({ boardGameId: gameId });
    if (!reviews.length) {
      // If no reviews are found, return an error
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron reseñas para este juego",
      });
    }

    // Calculate the total rating and compute the average
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

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAverageRating,
  getReviewById,
};
