const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  registerUser,
  confirmAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  revalidateToken,
} = require("../controllers/authController");

const router = express.Router();

// Register an user
router.post(
  "/register",
  [
    check("username", "El nombre de usuario es obligatorio").not().isEmpty(),
    check(
      "username",
      "El nombre de usuario debe tener mínimo 5 caracteres",
    ).isLength({ min: 5 }),
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "Introduce un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({
      min: 8,
    }),
    check(
      "password",
      "La contraseña debe contener al menos una mayúscula",
    ).matches(/[A-Z]/),
    check("sex", 'El sexo es obligatorio y debe ser "M", "F", u "Otro"').isIn([
      "M",
      "F",
      "Otro",
    ]),
    validateFields,
  ],
  registerUser,
);

// Confirm account
router.get("/confirm-account/:token", confirmAccount);

// Login
router.post(
  "/",
  [
    check("emailOrUsername", "El username o el email es obligatorio")
      .not()
      .isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  loginUser,
);

// Forgot password
router.post(
  "/forgot-password",
  [
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "Introduzca un email válido").isEmail(),
  ],
  validateFields,
  forgotPassword,
);

// Reset password
router.post(
  "/reset-password/:token",
  [
    check("newPassword", "La contraseña es obligatoria").not().isEmpty(),
    check(
      "newPassword",
      "La contraseña debe tener mínimo 8 caracteres",
    ).isLength({ min: 8 }),
  ],
  validateFields,
  resetPassword,
);

// Validar y revalidar token
router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
