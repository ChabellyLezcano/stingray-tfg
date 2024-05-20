const { Reservation } = require("../models/Reservation");
const { User } = require("../models/User");
const { Boardgame } = require("../models/Boardgame");

const {
  sendEmailReservationConfirmation,
  sendEmailReservationRejection,
  sendEmailReservationCompleted,
  sendEmailReservationPickedUp,
  sendEmailNewReservation,
  sendEmailCancelReservation,
} = require("../helpers/email");

const { generateRandCodeReservation } = require("../helpers/generateRandCode");

const getAdminReservationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.id;

    const adminUser = await User.findById(userId);
    if (adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores tienen acceso al historial de reservas",
      });
    }

    const options = {
      page: Math.max(1, parseInt(page)), // Asegura que page sea al menos 1
      limit: Math.max(1, parseInt(limit)), // Asegura que limit sea al menos 1
      populate: ["userId", "boardGameId"],
      sort: { reservationDate: -1 }, // Ordenar por fecha de reserva en orden descendente
    };

    const result = await Reservation.paginate({}, options);

    res.json({
      ok: true,
      reservations: result.docs,
      totalRecords: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error capturando las reservas",
    });
  }
};

// Accept reservations
const acceptReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;

    const adminUser = await User.findById(userId);

    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores están autorizados a aceptar reservas",
      });
    }

    // Encontrar una reservación por id
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status !== "Pending") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser aceptada en su estatus actual",
      });
    }

    const existingAcceptedReservation = await Reservation.findOne({
      boardGameId: reservation.boardGameId,
      status: "Accepted",
    });

    if (existingAcceptedReservation) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una reservación aceptada para este juego",
      });
    }

    // Calcular la fecha de expiración como 7 días después de la fecha actual
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Establecer la fecha de expiración
    reservation.expirationDate = expirationDate;

    // Establecer el estado de la reservación como "Accepted"
    reservation.status = "Accepted";

    const userWhoReserved = await User.findById(reservation.userId);

    await reservation.save();

    // Encontrar el juego con el id de la reservación
    const game = await Boardgame.findById(reservation.boardGameId);
    if (!game) {
      return res.status(404).json({
        ok: false,
        message: "Juego no encontrado",
      });
    }

    // Actualizar el estado del juego a "Occupied"
    await Boardgame.findByIdAndUpdate(reservation.boardGameId, {
      status: "Occupied",
    });

    await sendEmailReservationConfirmation(
      userWhoReserved.email,
      reservation,
      game,
      userWhoReserved.username
    );

    res.json({
      ok: true,
      msg: "Reservación aceptada correctamente y estado del juego actualizado a Ocupado",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error aceptando la reservación o actualizando el estado del juego",
    });
  }
};


// Reject reservation
const rejectReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;
    const { rejectionMessage } = req.body;

    const adminUser = await User.findById(userId);

    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores están autorizados a rechazar reservas",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    const game = await Boardgame.findById(reservation.boardGameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    if (reservation.status !== "Pending") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser rechazada en su estatus actual",
      });
    }

    // Set rejection message
    reservation.rejectionMessage = rejectionMessage;
    reservation.status = "Rejected";

    await reservation.save();

    // Send email to user with rejection message and another data
    const userWhoReserved = await User.findById(reservation.userId);
    if (userWhoReserved) {
      await sendEmailReservationRejection(
        userWhoReserved.email,
        reservation,
        game,
        userWhoReserved.username,
      );
    }

    res.json({
      ok: true,
      msg: "Reservación rechazada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error rechazando la reservación",
    });
  }
};

// Mark game as "Picked Up"
const markAsPickedUp = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;

    const adminUser = await User.findById(userId);

    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Solo los administradores están autorizados a marcar como recogida una reserva",
      });
    }

    // Encontrar la reservación por id
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    const game = await Boardgame.findById(reservation.boardGameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    // Verificar si el estado de la reservación es "Accepted"
    if (reservation.status !== "Accepted") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no está en el estado 'Accepted' y no puede ser marcada como recogida",
      });
    }

    // Establecer la fecha de recogida a la fecha actual
    reservation.pickupDate = new Date();

    // Calcular la nueva fecha de expiración (7 días desde la fecha de recogida)
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + 7);
    reservation.expirationDate = newExpirationDate;

    // Actualizar el estado de la reservación a "Picked Up"
    reservation.status = "Picked Up";

    await reservation.save();

    // Encontrar la información del usuario que hizo la reservación
    const userWhoReserved = await User.findById(reservation.userId);

    // Enviar un correo electrónico al usuario con los cambios en la reservación
    await sendEmailReservationPickedUp(
      userWhoReserved.email,
      reservation,
      game,
      userWhoReserved.username
    );

    res.json({
      ok: true,
      msg: "Reservación marcada como recogida correctamente, y fecha de expiración actualizada",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error marcando la reservación como recogida",
    });
  }
};

// Mark game reservation as "Completed"
const markAsCompleted = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;

    const adminUser = await User.findById(userId);

    if (!adminUser || adminUser.role !== 'Admin') {
      return res.status(401).json({
        ok: false,
        msg: 'Solo los administradores están autorizados a marcar reservas como completadas',
      });
    }

    // Encontrar la reservación por id
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: 'Reservación no encontrada',
      });
    }

    const game = await Boardgame.findById(reservation.boardGameId);
    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: 'Juego no encontrado',
      });
    }

    // Verificar si el estado de la reservación es "Picked Up" o "Expired"
    if (reservation.status !== 'Picked Up' && reservation.status !== 'Expired') {
      return res.status(400).json({
        ok: false,
        msg: 'La reservación no está en el estado "Picked Up" o "Expired" y no puede ser marcada como completada',
      });
    }

    // Establecer la fecha de devolución a la fecha actual
    reservation.returnDate = new Date();

    // Marcar wasExpired como true si el estado es "Expired"
    if (reservation.status === 'Expired') {
      reservation.wasExpired = true;
    }

    // Actualizar el estado de la reservación a "Completed"
    reservation.status = 'Completed';

    // Actualizar el estado del juego a "Available"
    await Boardgame.findByIdAndUpdate(reservation.boardGameId, {
      status: 'Available',
    });

    await reservation.save();

    // Enviar un correo electrónico al usuario con los cambios en la reservación
    const userWhoReserved = await User.findById(reservation.userId);
    if (userWhoReserved) {
      await sendEmailReservationCompleted(
        userWhoReserved.email,
        reservation,
        game,
        userWhoReserved.username
      );
    }

    res.json({
      ok: true,
      msg: 'Reservación marcada como completada correctamente',
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error marcando la reservación como completada',
    });
  }
};

// Create reservation
const createReservation = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const userId = req.id;

    const user = await User.findById(userId);

    if (user.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no pueden crear reservas",
      });
    }

    // Verify if already exists a reservation of the user for that game
    const existingPendingReservation = await Reservation.findOne({
      userId: userId,
      boardGameId: gameId,
      status: "Pending",
    });

    if (existingPendingReservation) {
      return res.status(400).json({
        ok: false,
        msg: "Ya tienes una reserva en proceso para este juego. No puedes crear otra en este momento.",
      });
    }

    const game = await Boardgame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    if (game.status !== "Available") {
      return res.status(400).json({
        ok: false,
        msg: "El juego no está disponible para su reserva",
      });
    }

    let code;
    let isCodeUnique = false;

    // Geerate reservation unique code
    while (!isCodeUnique) {
      code = generateRandCodeReservation();
      // Verify if already exists that code of reservation in db
      const existingReservation = await Reservation.findOne({ code });
      if (!existingReservation) {
        isCodeUnique = true;
      }
    }

    const reservationDate = new Date();

    const newReservation = new Reservation({
      code: code,
      boardGameId: gameId,
      userId: userId,
      code,
      reservationDate,
      status: "Pending",
    });

    const reservation = await newReservation.save();

    // Send email with reservation changes
    await sendEmailNewReservation(user.email, reservation, game, user.username);

    res.status(201).json({
      ok: true,
      msg: "Reservación creada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando reservación",
    });
  }
};

// Get user reservation history
const getUserReservationHistory = async (req, res) => {
  try {
    const userId = req.id;

    const reservations = await Reservation.find({ userId: userId }).populate(
      "boardGameId",
    );

    // Update status of reservations
    for (const reservation of reservations) {
      // Check if reservation has passed its expiration date
      if (reservation.expirationDate < new Date()) {
        // Mark the reservation as "Expired"
        reservation.status = "Expired";
        await reservation.save();

        // If the reservation status was "Accepted", then also mark the associated game as "Available"
        if (reservation.status === "Accepted") {
          const game = await Boardgame.findById(reservation.boardGameId);
          if (game) {
            // Ensure the game exists before attempting to update
            game.status = "Available";
            await game.save();
          }
        }
      }
    }

    res.json({
      ok: true,
      msg: "Reservaciones del usuario obtenidas",
      reservations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el historial de reservaciones del usuario",
    });
  }
};

// Cancel reservation
const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const userId = req.id;

    const user = await User.findById(userId);

    if (user.role === "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "Los administradores no pueden anular reservaciones",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        ok: false,
        msg: "Reservación no encontrada",
      });
    }

    if (reservation.status != "Pending") {
      return res.status(400).json({
        ok: false,
        msg: "La reservación no puede ser cancelada en su estatus actual",
      });
    }

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    reservation.status = "Cancelled";

    await reservation.save();

    // Only if the reservation is valid should you attempt to get the game
    const game = await Boardgame.findById(reservation.boardGameId);

    if (!game) {
      return res.status(404).json({
        ok: false,
        msg: "Juego no encontrado",
      });
    }

    // Send a confirmation email to the user
    await sendEmailCancelReservation(
      user.email,
      reservation,
      game,
      user.username,
    );

    res.json({
      ok: true,
      msg: "Reservación cancelada correctamente",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error cancelando reserva",
    });
  }
};

const hasUserReservationForGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.id;

    const existingReservation = await Reservation.findOne({
      userId: userId,
      boardGameId: gameId,
      status: { $in: ["Pending", "Accepted", "Picked Up"] },
    });

    if (existingReservation) {
      return res.json({
        ok: true,
        hasReservation: true,
        reservation: existingReservation,
      });
    } else {
      return res.json({
        ok: true,
        hasReservation: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error verificando la reserva del usuario para el juego",
    });
  }
};


module.exports = {
  getAdminReservationHistory,
  acceptReservation,
  rejectReservation,
  markAsCompleted,
  markAsPickedUp,
  createReservation,
  getUserReservationHistory,
  cancelReservation,
  hasUserReservationForGame,
};
