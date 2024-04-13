const express = require("express");
const { check } = require("express-validator");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getAverageRating,
} = require("../controllers/reviewController");

const router = express.Router();

router.use(validateJWT, validateFields);

// Create a review
router.post(
  "/:gameId",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    check(
      "rating",
      "La calificación es requerida y debe ser un número entre 1 y 5",
    )
      .isNumeric()
      .isInt({ min: 1, max: 5 }),
    validateFields,
  ],
  createReview,
);

// Retrieve all reviews for a game
router.get("/:gameId", getReviews);

// Update a review
router.put(
  "/:reviewId",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    check(
      "rating",
      "La calificación es requerida y debe ser un número entre 1 y 5",
    )
      .isNumeric()
      .isInt({ min: 1, max: 5 }),
    validateFields,
  ],
  updateReview,
);

// Delete a review
router.delete("/:reviewId", deleteReview);

// Retrieve the average rating for a game
router.get("/average-rating/:gameId", getAverageRating);

module.exports = router;
