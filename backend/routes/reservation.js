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
} = require("../controllers/reservationController");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

router.use(validateJWT, validateFields);

// Rutas para la gestión de reservas
router.post("/:gameId", createReservation); // Crear una nueva reserva
router.get("/admin/history", getAdminReservationHistory); // Historial de reservaciones (Admin)
router.get("/user/history", getUserReservationHistory); // Historial de reservaciones del usuario

// Aprobación y rechazo de reservas por el administrador
router.patch("/:reservationId/accept", acceptReservation); // Aprobar reserva
router.patch("/:reservationId/reject", rejectReservation); // Rechazar reserva

// Manejo de recogida y devolución de juegos
router.patch("/:reservationId/pickup", markAsPickedUp); // Marcar como recogido
router.patch("/:reservationId/completed", markAsCompleted); // Marcar como devuelto

// Cancelar una reserva
router.patch("/:reservationId/cancel", cancelReservation); // Cancelar reserva

// Exportar el router
module.exports = router;
