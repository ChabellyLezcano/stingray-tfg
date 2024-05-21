const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  updateProfile,
  updatePhoto,
  getProfile,
} = require("../controllers/profileController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.use(validateJWT, validateFields);

router.get("/", getProfile);

// Update profile
router.patch(
  "/update-profile",
  [
    check(
      "username",
      "El nombre de usuario es obligatorio y debe tener al menos 3 caracteres",
    ).isLength({ min: 3 }),
    check("username", "El nombre de usuario es obligatorio").notEmpty(),
    check("sex", "El sexo es obligatorio y debe ser 'M', 'F', u 'Otro'").isIn([
      "M",
      "F",
      "Otro",
    ]),
    check("birthDate", "La fecha de nacimiento es obligatoria").notEmpty(),
    check("password", "La fecha password es obligatoria").notEmpty(),
  ],
  updateProfile,
);

// Update photo
router.post("/update-photo", upload.single("photo"), updatePhoto);

module.exports = router;
