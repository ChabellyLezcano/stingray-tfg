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
const formatDateToMongoDB = require("../helpers/formatDate.js");

// Registration
const registerUser = async (req, res) => {
  const { username, email, password, validatePassword, role, sex, birthDate } =
    req.body;

  try {
    // Check if the user exists with the entered email
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "A user already exists with that email",
      });
    }

    // Verify that the username is unique
    const userByUsername = await User.findOne({ username });

    if (userByUsername) {
      return res.status(400).json({
        ok: false,
        msg: "A user already exists with that username",
      });
    }

    // Check if password and validatePassword match
    if (password !== validatePassword) {
      return res.status(400).json({
        ok: false,
        msg: "Las contraseñas no coinciden",
      });
    }

    // Obtain a random image
    const image = randomImage();

    const formattedBirthDate = formatDateToMongoDB(birthDate);

    // Create the new user with the fields sex and birthDate if they are available
    const newUser = new User({
      photo: image,
      username,
      email,
      password, // Password will be hashed later
      role,
      token: null, // Leave the token as null initially
      sex, // Add the sex field to the new user
      birthDate: formattedBirthDate, // Add the birthDate field to the new user
    });

    // Hash password
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    // Generate user token
    const token = await generateID();
    newUser.token = token;

    // Save user
    await newUser.save();

    // Send account confirmation email
    sendEmailConfirmation(newUser.email, newUser.token);

    // Response with user info
    res.status(200).json({
      ok: true,
      _id: newUser._id,
      photo: image,
      username: newUser.username, // Add the username to the response
      email: newUser.email,
      authenticated: newUser.authenticated,
      token,
      role,
      sex, // Add sex to the response
      birthDate, // Add birthDate to the response
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

// Confirm Account
const confirmAccount = async (req, res) => {
  const { token } = req.params; // Capture the token from the URL or header

  try {
    // Find a user in the database with the captured token from the request
    const user = await User.findOne({ token: token });

    // Check if the user does not exist in the database
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido. No se ha posido confirmar su cuenta",
      });
    }

    // Set authenticated to true if the account is confirmed successfully
    user.authenticated = true;

    // Set the token to null
    user.token = null;

    // Save changes to the database
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    // Send successful response
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

// Login
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Find user in database by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // The user doesn't exist in the database
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El email o nombre de usuario no existe",
      });
    }

    // Confirm account if it's not
    if (!user.authenticated) {
      return res.status(401).json({
        ok: false,
        msg: "La cuenta no ha sido confirmada. Por favor, verifique su correo electrónico",
      });
    }

    // Confirm validate password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      });
    }

    // Generate the JWT
    const token = await generateJWT(user.id);

    // Update token
    user.token = token;

    // Save user
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

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if a user exists with the provided email
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
    // Generate a token to reset the password
    const token = generateID();

    // Save the token in the database
    user.token = token;
    await user.save();

    // Send email to set password
    await sendEmailResetPassword(email, token);

    // Send successful response
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

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find a user in the database with the provided token
    const user = await User.findOne({ token });

    // Check if a user with the token is found
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

    // Update the user's password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(newPassword, salt);

    // Set the token to null
    user.token = null;

    // Save changes to the database
    await user.save();

    // Respond with a success message
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

// Check Token
const checkToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Check if the token exists in the database
    const user = await User.findOne({ token });

    if (user) {
      // Here you can return the user's information
      return res.status(200).json({
        ok: true,
        user,
        msg: "Token confirmed",
      });
    } else {
      return res.status(401).json({
        ok: false,
        msg: "Token inválido",
      });
    }
  } catch (error) {
    // In case of an error, return an error
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al validar el token",
    });
  }
};

// Revalidate Token
const revalidateToken = async (req, res) => {
  try {
    const userId = req.id;

    // Generate the JWT
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
  checkToken,
  revalidateToken,
};
