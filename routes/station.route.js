const express = require("express");
const stationController = require("../controllers/station.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateStation = require("../middleware/validate.station.middleware");
const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    validateStation.validateAddStationRequest,
    stationController.addStation,
  );
router.route("/:stationId").get(stationController.getStationById);

module.exports = router;
