const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const {
  sendEmailConfirmation,
  sendEmailResetPassword,
  sendWelcomeEmail,
} = require("../helpers/email.js");
const generateID = require("../helpers/generateId");
const { randomImage } = require("../helpers/randomImage");

// Controller to register a new user
const registerUser = async (req, res) => {
  const { username, email, password, role, sex, birthDate } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con esas credenciales",
      });
    }

    const image = randomImage();

    const newUser = new User({
      photo: image,
      username,
      email,
      password,
      role,
      token: null,
      sex,
      birthDate,
    });

    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    const token = await generateID();
    newUser.token = token;

    await newUser.save();

    sendEmailConfirmation(newUser.email, newUser.token);

    res.status(200).json({
      ok: true,
      _id: newUser._id,
      photo: image,
      username: newUser.username,
      email: newUser.email,
      authenticated: newUser.authenticated,
      token,
      role,
      sex,
      birthDate,
      msg: "The account confirmation email has been sent. Please check your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, talk to the administrator",
    });
  }
};

// Controller to confirm a user's account
const confirmAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido. No se ha posido confirmar su cuenta",
      });
    }

    user.authenticated = true;
    user.token = null;

    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    res.status(200).json({
      ok: true,
      msg: "Cuenta confirmada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error confirmando su cuenta. Por favor, contacte con el administrador",
    });
  }
};

// Controller to log in a user
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El email o nombre de usuario no existe",
      });
    }

    if (!user.authenticated) {
      return res.status(401).json({
        ok: false,
        msg: "La cuenta no ha sido confirmada. Por favor, verifique su correo electrónico",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      });
    }

    const token = await generateJWT(user.id);
    user.token = token;

    await user.save();

    return res.status(200).json({
      ok: true,
      msg: "Inicio de sesión correcto",
      _id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      photo: user.photo,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

// Controller to handle forgotten password request
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese correo electrónico",
      });
    }

    if (!user.authenticated) {
      return res.status(403).json({
        ok: false,
        msg: "Necesitas autenticar tu cuenta antes de cambiar la contraseña",
      });
    }

    const token = generateID();

    user.token = token;
    await user.save();
    await sendEmailResetPassword(email, token);

    res.status(200).json({
      msg: "Se ha enviado un correo electrónico para restablecer la contraseña.",
      ok: true,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al procesar la solicitud." });
  }
};

// Controller to reset a user's password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Token no válido",
      });
    }

    if (!user.authenticated) {
      return res.status(403).json({
        ok: false,
        msg: "Necesitas autenticar tu cuenta antes de cambiar la contraseña",
      });
    }

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(newPassword, salt);
    user.token = null;

    await user.save();

    return res.status(200).json({
      ok: true,
      msg: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar la contraseña",
    });
  }
};

// Controller to revalidate a user's session token
const revalidateToken = async (req, res) => {
  try {
    const userId = req.id;
    const token = await generateJWT(userId);
    const user = await User.findById(userId);

    const response = {
      ok: true,
      _id: userId,
      token,
      role: user.role,
      email: user.email,
      username: user.username,
      photo: user.photo,
      msg: "Sesión renovada",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    const errorResponse = {
      ok: false,
      msg: "Error al renovar la sesión. Contacte con el administrador",
    };

    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  registerUser,
  confirmAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  revalidateToken,
};
