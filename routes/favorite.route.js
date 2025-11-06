const favoriteController = require("../controllers/favorite.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const express = require("express");
const router = express.Router();

router
  .route("/:stationId")
  .post(authMiddleware, favoriteController.toggleFavorite)
  .get(authMiddleware, favoriteController.getFavorites);
router.route("/count/:stationId").get(favoriteController.getFavoriteCount);

module.exports = router;
