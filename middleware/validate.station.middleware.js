const stationSchema = require("../validations/station.validation");
const BadRequestError = require("../errors/custom.error");

const validateAddStationRequest = async (req, res, next) => {
  try {
    const validated = await stationSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.body = validated;
    next();
  } catch (error) {
    if (error.isJoi) {
      const message = error.details.map((detail) => detail.message).join(", ");
      throw new BadRequestError(message);
    }
  }
};

module.exports = {
  validateAddStationRequest,
};
