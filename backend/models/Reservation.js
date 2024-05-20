const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const reservationSchema = new mongoose.Schema({
  code: { type: String, required: true },
  boardGameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Boardgame",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reservationDate: Date,
  pickupDate: Date,
  returnDate: Date,
  expirationDate: Date,
  rejectionMessage: String,
  status: {
    type: String,
    required: true,
    enum: [
      "Accepted",
      "Pending",
      "Rejected",
      "Picked Up",
      "Completed",
      "Cancelled",
      "Expired",
    ],
    default: "Pending",
  },
});

// Add the mongoose-paginate-v2 plugin to the schema
reservationSchema.plugin(mongoosePaginate);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = { Reservation };
