const express = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  addGameToFavorites,
  removeGameFromFavorites,
  listFavorites,
} = require("../controllers/favoriteController");

const router = express.Router();

router.use(validateJWT, validateFields);

router.post(
  "/:gameId",
  [
    check("gameId", "El ID del juego es obligatorio").not().isEmpty(),
    check("userId", "El ID del usuario es obligatorio").not().isEmpty(),
  ],
  addGameToFavorites,
);

router.delete(
  "/:gameId",
  [
    check("gameId", "El ID del juego es obligatorio").not().isEmpty(),
    check("userId", "El ID del usuario es obligatorio")
      .exists()
      .not()
      .isEmpty(),
  ],
  removeGameFromFavorites,
);

router.get("/", listFavorites);

module.exports = router;
