const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  updateProfile,
  updatePhoto,
} = require("../controllers/profileController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.use(validateJWT, validateFields);

// Update profile
router.put(
  "/update-profile",
  [
    check(
      "username",
      "El nombre de usuario es obligatorio y debe tener al menos 3 caracteres",
    ).isLength({ min: 3 }),
    check("sex", "El sexo es obligatorio y debe ser 'M', 'F', u 'Otro'").isIn([
      "M",
      "F",
      "Otro",
    ]),
    check(
      "birthDate",
      "La fecha de nacimiento debe tener formato DD/MM/YYYY",
    ).matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, "g"),
  ],
  updateProfile,
);

// Update photo
router.post("/update-photo", upload.single("photo"), updatePhoto);

module.exports = router;
