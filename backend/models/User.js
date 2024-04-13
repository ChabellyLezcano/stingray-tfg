const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  photo: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },
  token: { type: String, default: null },
  authenticated: { type: Boolean, default: false },
  sex: {
    type: String,
    enum: ["M", "F", "Otro"],
    required: true,
  },
  birthDate: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
