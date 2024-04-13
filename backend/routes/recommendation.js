const express = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
  generateRecommendations,
} = require("../controllers/recommendationController");

const router = express.Router();

router.use(validateJWT);

router.get("/", [], generateRecommendations);

module.exports = router;
