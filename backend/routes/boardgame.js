const express = require("express");
const { check } = require("express-validator");
const upload = require("../middlewares/upload"); // Ensure you have the correct path to your upload middleware
const { validateFields } = require("../middlewares/validate-fields");
const {
  createBoardGame,
  deleteBoardGame,
  updateBoardGame,
  listBoardGames,
  viewBoardGameDetails,
} = require("../controllers/boardGameController");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = express.Router();

router.use(validateJWT, validateFields);

// Create Boardgame
router.post(
  "/",
  [
    upload.fields([
      { name: "mainPhoto", maxCount: 1 },
      { name: "photoGallery", maxCount: 3 },
    ]),
    check("title", "El título es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    check("tags", "Los tags son obligatorios")
      .not()
      .isEmpty()
      .custom((value) => {
        if (value.split(",").some((tag) => tag.trim().length === 0)) {
          throw new Error(
            "Todos los tags deben contener caracteres no espaciales",
          );
        }
        return true;
      }),
  ],
  createBoardGame,
);

// Update Boardgame
router.put(
  "/:id",
  [
    upload.fields([
      { name: "mainPhoto", maxCount: 1 },
      { name: "photoGallery", maxCount: 3 },
    ]),
    check("title", "El título es obligatorio").not().isEmpty(),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    check("tags", "Los tags son obligatorios")
      .not()
      .isEmpty()
      .custom((value) => {
        if (value.split(",").some((tag) => tag.trim().length === 0)) {
          throw new Error(
            "Todos los tags deben contener caracteres no espaciales",
          );
        }
        return true;
      }),
  ],
  updateBoardGame,
);

// Delete Boardgame
router.delete("/:id", deleteBoardGame);

// List Boardgames
router.get("/", listBoardGames);

// View Boardgame Details
router.get("/:id", viewBoardGameDetails);

module.exports = router;
