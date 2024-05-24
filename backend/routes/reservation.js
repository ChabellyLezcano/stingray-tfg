const express = require("express");
const router = express.Router();

// Importar los controladores
const {
  getAdminReservationHistory,
  acceptReservation,
  rejectReservation,
  markAsCompleted,
  markAsPickedUp,
  createReservation,
  getUserReservationHistory,
  cancelReservation,
  hasUserReservationForGame,
  deleteReservation,
} = require("../controllers/reservationController");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

router.use(validateJWT, validateFields);

// Create a reservation
router.post("/:gameId", createReservation);

// Get admin reservations history
router.get("/admin/history", getAdminReservationHistory);

// Get user reservations history
router.get("/user/history", getUserReservationHistory);

// Accept a reservation
router.patch("/:reservationId/accept", acceptReservation);

// Reject a reservation
router.patch("/:reservationId/reject", rejectReservation);

// Mark a reservations as picked up
router.patch("/:reservationId/pickup", markAsPickedUp);

// Mark a reservation as completed
router.patch("/:reservationId/completed", markAsCompleted);

// Cancel a reservation
router.patch("/:reservationId/cancel", cancelReservation);

// Check if user has reserved a game
router.get("/has-reservation/:gameId", hasUserReservationForGame);

module.exports = router;
