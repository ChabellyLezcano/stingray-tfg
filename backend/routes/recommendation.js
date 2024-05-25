const express = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
  getRecommendations,
  generateRecommendations,
} = require("../controllers/recommendationController");

const router = express.Router();

router.use(validateJWT);

// Generate or update recommendations
router.post("/generate", generateRecommendations);

// Get recommendations
router.get("/", getRecommendations);

module.exports = router;
