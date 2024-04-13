const { User } = require("../models/User");
const formatDateToMongoDB = require("../helpers/formatDate.js");

const updateProfile = async (req, res) => {
  const userId = req.id;
  const { username, sex, birthDate } = req.body;

  try {
    // Check if the username or email already exists in another document (exclude the current user)
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre de usuario no está disponible",
      });
    }

    // Check the fields for update
    const updatedFields = {
      ...(username && { username }),
      ...(sex && { sex }),
      ...(birthDate && { birthDate: formatDateToMongoDB(birthDate) }),
    };

    // Find the user and update their profile
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    // Respond with the updated user information
    res.status(200).json({
      ok: true,
      msg: "Perfil actualizado correctamente",
      user: {
        username: updatedUser.username,
        sex: updatedUser.sex,
        birthDate: updatedUser.birthDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error actualizando el perfil. Por favor, contacte con el administrador",
    });
  }
};

const updatePhoto = async (req, res) => {
  console.log("File object:", req.file);
  const userId = req.id;

  const photo = req.file.path; // Path of the uploaded image file

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        photo: photo,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      success: true,
      message: "Foto de perfil actualizada correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la foto de perfil del usuario",
    });
  }
};

module.exports = {
  updateProfile,
  updatePhoto,
};
