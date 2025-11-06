const express = require("express");
const stationController = require("../controllers/station.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateStation = require("../middleware/validate.station.middleware");
const validateRequestMiddleware = require("../middleware/validate.request.middleware");
const { stationQuerySchema } = require("../validations/station.validation");
const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    validateStation.validateAddStationRequest,
    stationController.addStation,
  );

router
  .route("/search")
  .get(
    validateRequestMiddleware(stationQuerySchema, "query"),
    stationController.getStationsByQuery,
  );

router.route("/coords").get(stationController.getStationsByCoords);

router
  .route("/:stationId")
  .get(stationController.getStationById)
  .delete(authMiddleware, stationController.deleteStation);

module.exports = router;
